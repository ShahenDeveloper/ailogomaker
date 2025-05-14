'use server';
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../configs/FirebaseConfig";
import JSZip from "jszip";
import sharp from "sharp";
import { Buffer } from "buffer";

export async function downloadLogo(logoId, email) {
  if (!logoId || !email) throw new Error("Missing logoId or email");

  // Fetch logo document
  const logoDocRef = doc(db, "users", email, "logos", logoId);
  const logoSnap = await getDoc(logoDocRef);
  if (!logoSnap.exists()) throw new Error("Logo not found");

  const logoData = logoSnap.data();
  const base64Image = logoData.imageOriginal;
  const imageTitle = logoData.title || "logo";

  // Fetch user document to get planName
  const userDocRef = doc(db, "users", email);
  const userSnap = await getDoc(userDocRef);
  if (!userSnap.exists()) throw new Error("User not found");

  const userData = userSnap.data();
  const planName = userData.planName || "Basic"; // default to Basic

  // Set image size based on plan
  let size;
  switch (planName) {
    case "Standard":
      size = 2500;
      break;
    case "Premium":
      size = 3000;
      break;
    default:
      size = 800;
  }

  // Decode base64 PNG data
  const base64Data = base64Image.startsWith("data:")
    ? base64Image.split(",")[1]
    : base64Image;
  const pngBuffer = Buffer.from(base64Data, "base64");

  // Resize image using sharp
  const resizedPngBuffer = await sharp(pngBuffer)
    .resize(size, size)
    .png()
    .toBuffer();

  const zip = new JSZip();
  zip.file(`${imageTitle}_${size}x${size}.png`, resizedPngBuffer);

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  return zipBuffer.toString("base64");
}
