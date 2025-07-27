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
"use server";
import { stripe } from "../../../lib/stripe";

export async function fetchPricingPlans() {
  const prices = await stripe.prices.list({ active: true, limit: 10 });

  const planCredits = {
    // price_1RoTY8GbJ1AxlUJijvhz9Arf: 300, // Basic
    // price_1RoTaaGbJ1AxlUJisgjNvGsS: 1000, // Standard
    // price_1RoTejGbJ1AxlUJilv7s8aMJ: 2100, // Premium
    price_1RoX2TLOSucFQ0CmRbu4fWJr: 300, // Basic
    price_1RoX4VLOSucFQ0CmNoWm32sP: 1000, // Standard
    price_1RoX6VLOSucFQ0Cm7VPn0XZv: 2100, // Premium
  };

  const planFeatures = {
    // price_1RoTY8GbJ1AxlUJijvhz9Arf: {
    price_1RoX2TLOSucFQ0CmRbu4fWJr: {
      "Create 300 Logo": true,
      "Watermarked Logos": false,
      "High Quality Png": true,
      "AI Base Logo": true,
      "800x800 Logo": true,
      "Download Unlimited Times": true,
    },
    // price_1RoTaaGbJ1AxlUJisgjNvGsS: {
    price_1RoX4VLOSucFQ0CmNoWm32sP: {
      "Create 1200 Logo": true,
      "Watermarked Logos": false,
      "High Quality Png": true,
      "AI Base Logo": true,
      "800x800 Logo": true,
      "Download Unlimited Times": true,
    },
    // price_1RoTejGbJ1AxlUJilv7s8aMJ: {
    price_1RoX6VLOSucFQ0Cm7VPn0XZv: {
      "Create 1800 Logo": true,
      "Watermarked Logos": false,
      "High Quality Png": true,
      "AI Base Logo": true,
      "800x800 Logo": true,
      "Download Unlimited Times": true,
    },
  };

  const order = { Basic: 0, Standard: 1, Premium: 2 };

  const plans = prices.data.map((p) => {
    const cents = p.unit_amount ?? 0;
    let name = "";
    if (p.id === "price_1RoX2TLOSucFQ0CmRbu4fWJr") name = "Basic";
    else if (p.id === "price_1RoX4VLOSucFQ0CmNoWm32sP") name = "Standard";
    else if (p.id === "price_1RoX6VLOSucFQ0Cm7VPn0XZv") name = "Premium";
    else name = p.id;
    return {
      name,
      pricingId: p.id,
      price: `$${(cents / 100).toFixed(2)}`,
      credits: planCredits[p.id] || 0,
      features: planFeatures[p.id] || {},
    };
  });

  plans.sort((a, b) => (order[a.name] ?? 99) - (order[b.name] ?? 99));

  return plans;
}
