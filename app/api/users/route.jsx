import { NextResponse } from "next/server";
import { db } from "../../../configs/FirebaseConfig";
import { getDoc, setDoc, doc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { userEmail, userName } = await req.json();

    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      const data = {
        name: userName,
        email: userEmail,
        credits: 0,
        subscription: "free",
        nextRenewal: null,
        usedCredits: 0,
        freeGenerations: 3,
      };
      await setDoc(docRef, data);
      return NextResponse.json(data);
    }
  } catch (e) {
    console.error("Firestore error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}