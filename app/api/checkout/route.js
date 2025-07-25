// app/api/checkout/route.js
import { stripe } from "../../../lib/stripe";

export async function POST(req) {
  try {
    const { email, planName, logoId, productId } = await req.json();

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: productId,
          quantity: 1,
        },
      ],
      metadata: { planName, logoId: logoId || "" },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo-success?logoId=${logoId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return Response.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Error creating checkout" },
      { status: 500 }
    );
  }
}
