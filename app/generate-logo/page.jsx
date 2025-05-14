"use client";
import React, {
  Suspense,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { UserDetailContex } from "../_context/UserDetailContext";
import Lookup from "../_data/Lookup";
import Prompt from "../_data/Prompt";
import axios from "axios";
import { toast } from "sonner";
import LoadingState from "./_components/LoadinState";
import { NoCreditsDialog } from "./_components/NoCreditsDialog";
import { LogoResult } from "./_components/LogoResult";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import Link from "next/link";
import { buttonVariants } from "../../components/ui/button";

function GenerateLogo() {
  const { userDetail, setUserDetail } = useContext(UserDetailContex);
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(false);
  const [logoImage, setLogoImage] = useState();
  const [logoId, setLogoId] = useState(null);
  const [imageOriginal, setImageOriginal] = useState(null);
  const [showNoCreditsDialog, setShowNoCreditsDialog] = useState(false);
  const router = useRouter();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      userDetail?.email &&
      !loadedRef.current
    ) {
      const storage = localStorage.getItem("formData");
      if (storage) {
        setFormData(JSON.parse(storage));
      }
      loadedRef.current = true;
    }
  }, [userDetail]);

  useEffect(() => {
    if (formData?.title?.length > 0 && !logoImage) {
      GenerateAILogo();
    }
  }, [formData]);

  const showErrorMessage = !formData && userDetail?.email;

  const GenerateAILogo = async () => {
    if (!userDetail) return;

    // Check credits for non-free users
    if (userDetail.subscription !== "free" && userDetail.credits < 1) {
      toast.error("Insufficient credits. Please purchase more.");
      setShowNoCreditsDialog(true);
      return;
    }

    setLoading(true);
    const PROMPT = Prompt.LOGO_PROMPT.replace("{logoTitle}", formData?.title)
      .replace("{logoDesc}", formData?.desc)
      .replace("{logoColor}", formData.palette)
      .replace("{logoIdea}", formData?.idea)
      .replace("{logoDesign}", formData?.design?.title)
      .replace("{logoPrompt}", formData?.design?.prompt);

    try {
      const result = await axios.post("/api/ai-logo-model", {
        prompt: PROMPT,
        email: userDetail.email,
        title: formData.title,
        desc: formData.desc,
        watermark: userDetail.subscription === "free" && userDetail.credits < 1,
      });

      localStorage.removeItem("formData");
      setLogoImage(result.data?.image);
      setImageOriginal(result.data?.imageOriginal);
      setLogoId(result.data?.logoId);

      // Update credits if used
      if (result.data?.usedCredit) {
        const userRef = doc(db, "users", userDetail.email);
        await updateDoc(userRef, {
          credits: userDetail.credits - 1,
          usedCredits: (userDetail.usedCredits || 0) + 1,
        });

        setUserDetail((prev) => ({
          ...prev,
          credits: prev.credits - 1,
          usedCredits: (prev.usedCredits || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate logo.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWatermark = async () => {
    if (userDetail.credits < 1) {
      toast.error("You need at least 1 credit to remove watermark");
      setShowNoCreditsDialog(true);
      return;
    }

    try {
      const userRef = doc(db, "users", userDetail.email);
      await updateDoc(userRef, {
        credits: userDetail.credits - 1,
        usedCredits: (userDetail.usedCredits || 0) + 1,
      });

      const logoRef = doc(db, "users", userDetail.email, "logos", logoId);
      await updateDoc(logoRef, {
        isWaterMark: false,
        image: imageOriginal,
      });

      setLogoImage(imageOriginal);
      setUserDetail((prev) => ({
        ...prev,
        credits: prev.credits - 1,
        usedCredits: (prev.usedCredits || 0) + 1,
      }));

      toast.success("Watermark removed successfully!");
    } catch (error) {
      console.error("Error removing watermark:", error);
      toast.error("Failed to remove watermark");
    }
  };

  const onDownload = () => {
    const imageWindow = window.open();
    imageWindow?.document.write(
      `<img src="${logoImage}" alt="Generated Logo" />`
    );
  };

  return (
    <Suspense>
      <div className="mt-16 flex flex-col items-center justify-center">
        <NoCreditsDialog
          open={showNoCreditsDialog}
          onOpenChange={setShowNoCreditsDialog}
          logoId={logoId}
        />

        {showErrorMessage ? (
          <div className="text-center space-y-4">
            <p className="text-red-500 text-lg font-medium">
              No data available. Please try again.
            </p>
            <Link
              href="/create"
              className={buttonVariants({ variant: "link" })}
            >
              Create New Logo
            </Link>
          </div>
        ) : (
          <>
            <h2 className="font-bold text-3xl text-primary">
              {Lookup.LoadingWaitTitle}
            </h2>
            {loading && <LoadingState />}
            {logoImage && (
              <LogoResult
                logoImage={logoImage}
                onDownload={onDownload}
                onRemoveWatermark={
                  userDetail?.subscription === "free" &&
                  logoImage !== imageOriginal
                    ? handleRemoveWatermark
                    : null
                }
                credits={userDetail?.credits}
                subscription={userDetail?.subscription}
              />
            )}
          </>
        )}
      </div>
    </Suspense>
  );
}

export default GenerateLogo;
