import { NextResponse } from "next/server";
import crypto from "crypto";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../configs/FirebaseConfig";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("X-Signature") ?? "";
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    if (!signature || !rawBody || !secret) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const expected = Buffer.from(
      crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
      "hex"
    );
    const received = Buffer.from(signature, "hex");

    if (!crypto.timingSafeEqual(expected, received)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const eventData = JSON.parse(rawBody);
    const eventName = eventData.meta?.event_name;

    if (eventName === "order_created") {
      const customData = eventData.meta?.custom_data || {};
      const { email, planName, logoId } = customData;

      if (!email || !planName) {
        return NextResponse.json({ error: "Missing email or planName" }, { status: 400 });
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
            isWaterMark: false
          });
          updatedCredits -= 1;
          console.log(`🖼️ Removed watermark from logo ${logoId} and deducted 1 credit`);
        } else {
          console.warn(`⚠️ Logo document not found: ${logoId}`);
        }
      }

      // 🔄 Update user's plan and credits
      await updateDoc(userRef, {
        credits: updatedCredits,
        planName: planName,
        subscription: planName
      });

      console.log(`✅ Added ${creditsToAdd} credits to ${email} for the ${planName} plan`);
    }

    return NextResponse.json({
      received: true,
      message: "Webhook processed successfully"
    });
  } catch (error) {
    console.error("❌ Lemon Squeezy webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}
