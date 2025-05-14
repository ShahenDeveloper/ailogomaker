'use server';

import { collection, getDocs} from "firebase/firestore";
import { db } from "../../../configs/FirebaseConfig";

export async function fetchPricingPlans() {
  const snapshot = await getDocs(collection(db, "pricingPlans"));
  const plans = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return plans;
}
