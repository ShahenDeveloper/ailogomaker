'use server';

import { db } from "../../configs/FirebaseConfig"; 
import { currentUser } from "@clerk/nextjs/server";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export async function fetchPricingPlansForAdmins() {
  const user = await currentUser();

  if (!user || !user.primaryEmailAddress) {
    throw new Error("UNAUTHORIZED");
  }

  const email = user.primaryEmailAddress.emailAddress;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!adminEmails.includes(email)) {
    throw new Error("UNAUTHORIZED");
  }

  const snapshot = await getDocs(collection(db, "pricingPlans"));
  const plans = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return plans;
}

export async function updatePricingPlan(planId, data) {
  const user = await currentUser();

  if (!user || !user.primaryEmailAddress) {
    throw new Error("UNAUTHORIZED");
  }

  const email = user.primaryEmailAddress.emailAddress;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!adminEmails.includes(email)) {
    throw new Error("UNAUTHORIZED");
  }

  const planRef = doc(db, "pricingPlans", planId);
  await updateDoc(planRef, data);
}
