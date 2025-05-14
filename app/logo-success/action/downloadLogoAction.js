'use server';
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../configs/FirebaseConfig";
import JSZip from "jszip";
import sharp from "sharp";

export async function downloadLogo(logoId, email) {
  if (!logoId || !email) throw new Error("Missing logoId or email");

  try {
    // Fetch logo document
    const logoDocRef = doc(db, "users", email, "logos", logoId);
    const logoSnap = await getDoc(logoDocRef);
    if (!logoSnap.exists()) throw new Error("Logo not found");

    const logoData = logoSnap.data();
    const base64Image = logoData.imageOriginal || logoData.image;
    const imageTitle = logoData.title?.replace(/[^a-z0-9]/gi, '_') || "logo";

    // Get user's plan
    const userDocRef = doc(db, "users", email);
    const userSnap = await getDoc(userDocRef);
    const userData = userSnap.exists() ? userSnap.data() : {};
    const planName = userData.planName || "Basic";

    // Determine image size based on plan
    const sizes = {
      "Standard": 2500,
      "Premium": 3000,
      "Basic": 800
    };
    const size = sizes[planName] || 800;

    // Process image
    const base64Data = base64Image.split(',')[1] || base64Image;
    const pngBuffer = Buffer.from(base64Data, 'base64');
    const resizedPngBuffer = await sharp(pngBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    // Create ZIP
    const zip = new JSZip();
    zip.file(`${imageTitle}_${size}x${size}.png`, resizedPngBuffer);
    
    // Add multiple sizes for premium users
    if (planName === "Premium") {
      const mediumBuffer = await sharp(pngBuffer).resize(1500, 1500).png().toBuffer();
      const smallBuffer = await sharp(pngBuffer).resize(500, 500).png().toBuffer();
      zip.file(`${imageTitle}_1500x1500.png`, mediumBuffer);
      zip.file(`${imageTitle}_500x500.png`, smallBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    return zipBuffer.toString('base64');
  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Failed to prepare download');
  }
}