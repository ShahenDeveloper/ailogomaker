"use server";
import { stripe } from "../../../lib/stripe";

export async function fetchPricingPlans() {
  const productIds = {
    // live product id
    Basic: "prod_Sk14EOAwxQFgzj", //  Basic
    Standard: "prod_Sk16ZF1p1I2vdx", //  Standard
    Premium: "prod_Sk18C3KKCmSRQa", //  Premium

    // test product id
    // Basic: "prod_Skw0FM5XQ3zodM", //  Basic
    // Standard: "prod_Skw0ZxLIap9Tog", //  Standard
    // Premium: "prod_Skw11vjvPLocDz", //  Premium
  };

  const planCredits = {
    [productIds.Basic]: 300,
    [productIds.Standard]: 1000,
    [productIds.Premium]: 2100,
  };

  const planFeatures = {
    [productIds.Basic]: {
      "Create 300 Logo": true,
      "Watermarked Logos": false,
      "High Quality Png": true,
      "AI Base Logo": true,
      "800x800 Logo": true,
      "Download Unlimited Times": true,
    },
    [productIds.Standard]: {
      "Create 1200 Logo": true,
      "Watermarked Logos": false,
      "High Quality Png": true,
      "AI Base Logo": true,
      "800x800 Logo": true,
      "Download Unlimited Times": true,
    },
    [productIds.Premium]: {
      "Create 1800 Logo": true,
      "Watermarked Logos": false,
      "High Quality Png": true,
      "AI Base Logo": true,
      "800x800 Logo": true,
      "Download Unlimited Times": true,
    },
  };

  const order = { Basic: 0, Standard: 1, Premium: 2 };

  // Fetch all active prices
  const prices = await stripe.prices.list({ active: true, limit: 20 });

  // Find the latest active price for each product
  function getLatestPrice(productId) {
    const productPrices = prices.data.filter(
      (p) => p.product === productId && p.active
    );
    // You can add logic to select price by currency, type, etc. if needed
    return productPrices.sort((a, b) => b.created - a.created)[0];
  }

  const plans = Object.entries(productIds).map(([name, productId]) => {
    const priceObj = getLatestPrice(productId);
    const cents = priceObj?.unit_amount ?? 0;
    return {
      name,
      pricingId: priceObj?.id || "",
      price: `$${(cents / 100).toFixed(2)}`,
      credits: planCredits[productId] || 0,
      features: planFeatures[productId] || {},
    };
  });

  plans.sort((a, b) => (order[a.name] ?? 99) - (order[b.name] ?? 99));

  return plans;
}

// // app/actions/fetchPricingPlans.ts
// "use server";

// import axios from "axios";
// import { fetchPricingPlans as fetchPlans } from "../../generate-logo/action/fetchPricingForUsers";

// export async function fetchPricingPlans() {

// const plans = await fetchPlans();
//  try {
//     const { data } = await axios.get("https://api.lemonsqueezy.com/v1/variants", {
//       headers: {
//         Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API}`,
//         Accept: "application/json",
//       },
//     });

//     const variants = data.data;
//     const updatedPlans = plans.map((plan) => {
//       if (plan.pricingId === "free") {
//         return { ...plan, price: "$0.00" };
//       }

//       const variant = variants.find((v) => v.id.toString() === plan.pricingId);
//       const priceInCents = variant?.attributes?.price || 0;
//       const formattedPrice = `$${(priceInCents / 100).toFixed(2)}`;

//       return {
//         ...plan,
//         price: formattedPrice,
//       };
//     });

//     return updatedPlans;
//   } catch (err) {
//     console.error("Failed to fetch prices:", err);
//     throw new Error("Could not fetch pricing plans");
//   }

// }
// app/pricing/actions/fetchPricingPlan.js
