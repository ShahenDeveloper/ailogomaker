// app/api/webhook/stripe/route.js
import { NextResponse } from "next/server";
import stripe from "../../../../lib/stripe";
import { db } from "../../../../configs/FirebaseConfig"; // or your DB setup

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature");
  if (!sig) {
    console.error("Missing Stripe-Signature header");
    return c.json({ error: "Missing Stripe-Signature header" }, 400);
  }
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error("Webhook signature failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    const email = session.customer_details?.email;
    const planName = session.metadata?.planName;
    const logoId = session.metadata?.logoId;

    if (!email || !planName) {
      return NextResponse.json(
        { error: "Missing email or planName" },
        { status: 400 }
      );
    }

    // Assign credits based on plan
    let creditsToAdd = 0;
    if (planName === "Basic") creditsToAdd = 300;
    else if (planName === "Standard") creditsToAdd = 1200;
    else if (planName === "Premium") creditsToAdd = 1800;

    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);
    const currentCredits = userSnap.exists() ? userSnap.data().credits || 0 : 0;
    let updatedCredits = currentCredits + creditsToAdd;

    // 🔒 Handle watermark removal only if logoId is provided
    if (logoId) {
      const logoRef = doc(db, "users", email, "logos", logoId);
      const logoSnap = await getDoc(logoRef);

      if (logoSnap.exists()) {
        await updateDoc(logoRef, {
          isWaterMark: false,
        });
        updatedCredits -= 1;
        console.log(
          `🖼️ Removed watermark from logo ${logoId} and deducted 1 credit`
        );
      } else {
        console.warn(`⚠️ Logo document not found: ${logoId}`);
      }
    }

    // 🔄 Update user's plan and credits
    await updateDoc(userRef, {
      credits: updatedCredits,
      planName: planName,
      subscription: planName,
    });

    console.log(
      `✅ Added ${creditsToAdd} credits to ${email} for the ${planName} plan`
    );
  }

  if (event.type === "invoice.payment_succeeded") {
    // Update subscription period, credits, etc.
  }

  return NextResponse.json({ received: true });
}
