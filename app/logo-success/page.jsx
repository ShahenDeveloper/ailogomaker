"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { UserDetailContex } from "../_context/UserDetailContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { downloadLogo } from "./action/downloadLogoAction";
import { Loader2 } from "lucide-react";

export default function LogoSuccessPage() {
  const searchParams = useSearchParams();
  const { userDetail } = useContext(UserDetailContex);
  const logoId = searchParams.get("logoId");

  const [logoUrl, setLogoUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [isWatermark, setIsWatermark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      if (!logoId) {
        setError("No logo ID provided in the URL.");
        return;
      }

      if (!userDetail?.email) return;

      try {
        const logoDocRef = doc(db, "users", userDetail.email, "logos", logoId);
        const logoSnap = await getDoc(logoDocRef);

        if (logoSnap.exists()) {
          const data = logoSnap.data();
          setIsWatermark(data.isWatermark);
          setLogoUrl(data.isWatermark ? data.imageWatermark : data.imageOriginal);
          setTitle(data.title);
        } else {
          setError("Logo not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching the logo.");
      }
    };

    fetchLogo();
  }, [userDetail, logoId]);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const base64Zip = await downloadLogo(logoId, userDetail.email);
      const binaryString = atob(base64Zip);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "logo"}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      {error ? (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-lg text-gray-700">{error}</p>
        </>
      ) : logoUrl ? (
        <>
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            🎉 Congratulations!
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            {isWatermark
              ? "You can preview your logo below."
              : "Your logo is ready to download without watermark."}
          </p>
          <img
            src={logoUrl}
            alt="Your AI Logo"
            className="w-[300px] md:w-[500px] mb-6 border-4 border-green-400 rounded-xl shadow-lg"
          />
          {!isWatermark && (
            <button
              disabled={loading}
              onClick={handleDownload}
              className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="text-sm text-muted-foreground mr-2">
                    It may take some time
                  </span>
                  <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                </>
              ) : (
                "Download"
              )}
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">Loading...</h1>
          <p className="text-lg text-gray-500 mb-6 text-center">
            Please wait while we prepare your logo.
          </p>
          <div className="flex space-x-4">
            <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  );
}
