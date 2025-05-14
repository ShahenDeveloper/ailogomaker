import { lemonSqueezyApiInstance } from "../../../lib/axios";

export async function POST(req) {
  try {
    const { email, planName, productId, logoId } = await req.json();

    if (!productId) {
      return Response.json(
        { message: "productId is required" },
        { status: 400 }
      );
    }

    const redirectUrl = logoId
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/logo-success?logoId=${logoId}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;

    const { data } = await lemonSqueezyApiInstance.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: { email, planName, logoId }
          },
          product_options: {
            redirect_url: redirectUrl
          }
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_SQUEEZY_STORE_ID.toString()
            }
          },
          variant: {
            data: {
              type: "variants",
              id: productId.toString()
            }
          }
        }
      }
    });

    return Response.json({ checkoutUrl: data.data.attributes.url });
  } catch (error) {
    console.error("API Error:", error.response?.data ?? error.message);
    return Response.json(
      {
        message: "An error occurred",
        error: error.response?.data ?? error.message
      },
      { status: 500 }
    );
  }
}
