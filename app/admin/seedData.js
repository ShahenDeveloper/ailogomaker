'use server';

import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { pricingPlans } from "../generate-logo/_components/PricingPlan";

export async function seedPricingPlans() {
  try {
    const pricingPlansCollection = collection(db, "pricingPlans");

    // Optional: load once to log what already existed
    const snapshot = await getDocs(pricingPlansCollection);
    const existingIds = snapshot.docs.map(d => d.id);
    console.log("Existing plan IDs:", existingIds);

    for (const plan of pricingPlans) {
      const docRef = doc(db, "pricingPlans", plan.pricingId.toString());
      // { merge: true } will only overwrite the fields in 'plan'
      await setDoc(docRef, plan, { merge: true });
      if (existingIds.includes(plan.pricingId.toString())) {
        console.log(`Updated plan: ${plan.name}`);
      } else {
        console.log(`Created plan: ${plan.name}`);
      }
    }

    console.log("Pricing plans upserted successfully.");
  } catch (error) {
    console.error("Error upserting pricing plans:", error);
  }
}
