// app/actions/fetchPricingPlans.ts
"use server";

import axios from "axios";
import { fetchPricingPlans as fetchPlans } from "../../generate-logo/action/fetchPricingForUsers";

export async function fetchPricingPlans() {

const plans = await fetchPlans();
 try {
    const { data } = await axios.get("https://api.lemonsqueezy.com/v1/variants", {
      headers: {
        Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API}`,
        Accept: "application/json",
      },
    });

    const variants = data.data;
    const updatedPlans = plans.map((plan) => {
      if (plan.pricingId === "free") {
        return { ...plan, price: "$0.00" };
      }

      const variant = variants.find((v) => v.id.toString() === plan.pricingId);
      const priceInCents = variant?.attributes?.price || 0;
      const formattedPrice = `$${(priceInCents / 100).toFixed(2)}`;

      return {
        ...plan,
        price: formattedPrice,
      };
    });

    return updatedPlans;
  } catch (err) {
    console.error("Failed to fetch prices:", err);
    throw new Error("Could not fetch pricing plans");
  }

}
