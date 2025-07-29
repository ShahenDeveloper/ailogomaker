import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { db } from "../../../../configs/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe-Signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventRef = doc(db, "stripe_events", event.id);
  if ((await getDoc(eventRef)).exists()) {
    return NextResponse.json({ received: true });
  }
  await setDoc(eventRef, {
    type: event.type,
    received: new Date().toISOString(),
  });

  const planTiers = { Basic: 1, Standard: 2, Premium: 3 };
  const creditMap = { Basic: 300, Standard: 1000, Premium: 2100 };
  function normalizePlanName(name) {
    if (!name) return null;
    if (/basic/i.test(name)) return "Basic";
    if (/standard/i.test(name)) return "Standard";
    if (/premium/i.test(name)) return "Premium";
    return null;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.mode === "subscription") {
      return NextResponse.json({ received: true });
    }
    const email = session.customer_details?.email;
    const plan = normalizePlanName(session.metadata?.planName);
    if (!email || !plan) {
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 }
      );
    }
    const userRef = doc(db, "users", email);
    const snap = await getDoc(userRef);
    const current = snap.exists() ? snap.data().credits || 0 : 0;
    await updateDoc(userRef, { credits: current + creditMap[plan] });
    return NextResponse.json({ received: true });
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    const email = invoice.customer_email;
    const rawDesc = invoice.lines.data[0]?.description;
    const plan = normalizePlanName(rawDesc);
    if (!email || !plan) {
      return NextResponse.json(
        { error: "Invalid invoice data" },
        { status: 400 }
      );
    }

    const userRef = doc(db, "users", email);
    const snap = await getDoc(userRef);
    const current = snap.exists() ? snap.data().credits || 0 : 0;

    const pending = snap.exists() ? snap.data().pendingPlan : null;
    const finalPlan = pending?.name || plan;
    const addCredits = creditMap[finalPlan];

    const updateData = {
      credits: current + addCredits,
      planName: finalPlan,
      planTier: planTiers[finalPlan],
      subscription: finalPlan,
      nextRenewal: new Date(invoice.period_end * 1000).toISOString(),
    };
    if (pending) {
      updateData.pendingPlan = null;
    }

    await updateDoc(userRef, updateData);
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
