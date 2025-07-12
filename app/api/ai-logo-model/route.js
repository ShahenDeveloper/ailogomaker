import { AILogoPrompt } from "../../../configs/AiModel";
import axios from "axios";
import { db } from "../../../configs/FirebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import sharp from "sharp";


export const maxDuration = 300;

export async function POST(req) {
  const { prompt, email, title, desc } = await req.json();

  try {
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userDoc = userSnap.data();
    const isFreeUser = userDoc.subscription === "free";
    const hasCredits = userDoc.credits > 0;
    const shouldWatermark = isFreeUser && !hasCredits;

    const AiPromptResult = await AILogoPrompt.sendMessage(prompt);
    const AIPrompt = JSON.parse(AiPromptResult.response.text()).prompt;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "bytedance/hyper-flux-8step:81946b1e09b256c543b35f37333a30d0d02ee2cd8c4f77cd915873a1ca622bad",
      {
        input: {
          prompt: AIPrompt,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "png",
          guidance_scale: 3.5,
          output_quality: 80,
          num_inference_steps: 8,
        },
      }
    );

    const imageUrl = output[0];
    const [imageWithWatermark, imageWithoutWatermark] = await Promise.all([
      ConvertImageToBase64(imageUrl, true),
      ConvertImageToBase64(imageUrl, false),
    ]);

    const docId = Date.now().toString();

    await setDoc(doc(db, "users", email, "logos", docId), {
      image: shouldWatermark ? imageWithWatermark : imageWithoutWatermark,
      imageOriginal: imageWithoutWatermark,
      title,
      desc,
      prompt: AIPrompt,
      id: docId,
      isWaterMark: shouldWatermark,
      usedCredit: hasCredits,
      createdAt: new Date().toISOString(),
    });

    if (hasCredits) {
      await updateDoc(userRef, {
        credits: userDoc.credits - 1,
        usedCredits: (userDoc.usedCredits || 0) + 1,
      });
    }

    return NextResponse.json({
      image: shouldWatermark ? imageWithWatermark : imageWithoutWatermark,
      imageOriginal: imageWithoutWatermark,
      logoId: docId,
      usedCredit: hasCredits,
      isWaterMark: shouldWatermark,
    });
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: e.message || "Generation failed" },
      { status: 500 }
    );
  }
}

async function ConvertImageToBase64(imageUrl, addWatermark = false) {
  const watermarkImagePath = "public/images/watermark.png";

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    let processedImage;
    if (addWatermark) {
      const watermark = await sharp(watermarkImagePath)
        .resize(500, 500)
        .toBuffer();

      processedImage = await sharp(imageBuffer)
        .resize(800, 800)
        .composite([
          {
            input: watermark,
            gravity: "center", // Changed to center position
            blend: "over",
          },
        ])
        .jpeg({ quality: 80 })
        .toBuffer();
    } else {
      // Original image processing
      processedImage = await sharp(imageBuffer)
        .resize(800, 800)
        .jpeg({ quality: 90 })
        .toBuffer();
    }

    return `data:image/jpeg;base64,${processedImage.toString("base64")}`;
  } catch (error) {
    console.error("Image processing error:", error);
    throw new Error("Failed to process image");
  }
}
