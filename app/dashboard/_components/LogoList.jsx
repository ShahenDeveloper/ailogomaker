"use client";
import { UserDetailContex } from "../../_context/UserDetailContext";
import { db } from "../../../configs/FirebaseConfig";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import Image from "next/image";
import EmptyState from "./EmptyState";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { NoCreditsDialog } from "../../generate-logo/_components/NoCreditsDialog";
import { downloadLogo } from "../../logo-success/action/downloadLogoAction";

function LogoList() {
  const { userDetail, setUserDetail } = useContext(UserDetailContex);
  const [logoList, setLogoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoCreditsDialog, setShowNoCreditsDialog] = useState(false);
  const [downloadingLogoId, setDownloadingLogoId] = useState(null);

  useEffect(() => {
    const getUserLogos = async () => {
      if (!userDetail) return;

      try {
        const q = query(collection(db, "users", userDetail.email, "logos"));
        const snap = await getDocs(q);
        const logos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLogoList(logos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userDetail) {
      getUserLogos();
    }
  }, [userDetail]);

  const handleDownload = async (logo) => {
    if (!userDetail) return;
    setDownloadingLogoId(logo.id); // Start loading

    try {
      const zipBuffer = await downloadLogo(logo.id, userDetail.email);
      const zipBlob = new Blob([Buffer.from(zipBuffer, "base64")], {
        type: "application/zip",
      });

      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `${logo.title || "logo"}_download.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloadingLogoId(null); // Stop loading
    }
  };

  const handleRemoveWatermark = async (logo) => {
    if (userDetail.credits < 1) {
      setShowNoCreditsDialog(true);
      return;
    }

    try {
      // Update user credits
      const userRef = doc(db, "users", userDetail.email);
      await updateDoc(userRef, {
        credits: userDetail.credits - 1,
        usedCredits: (userDetail.usedCredits || 0) + 1,
      });

      // Update logo document
      const logoRef = doc(db, "users", userDetail.email, "logos", logo.id);
      await updateDoc(logoRef, {
        isWaterMark: false,
        image: logo.imageOriginal,
      });

      // Update local state
      setLogoList((prev) =>
        prev.map((l) =>
          l.id === logo.id
            ? { ...l, isWaterMark: false, image: l.imageOriginal }
            : l
        )
      );
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

  return (
    <div className="mt-10 px-4 sm:px-6 mb-12 lg:px-12 xl:px-20">
      <NoCreditsDialog
        open={showNoCreditsDialog}
        onOpenChange={setShowNoCreditsDialog}
      />

      {loading ? (
        <div className="flex justify-center items-center h-[300px] w-full">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : logoList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {logoList.map((logo, index) => (
            <div
              key={index}
              className="hover:scale-105 transition-transform duration-300 cursor-pointer group relative"
            >
              <div className="relative">
                <Image
                  src={logo.isWaterMark ? logo.image : logo.imageOriginal}
                  width={400}
                  height={200}
                  className="w-full rounded-xl object-cover"
                  alt={logo.title}
                />
                {/* {logo.isWaterMark && (
                  <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-xl">
                    <span className="text-white font-bold text-lg">
                      Watermarked Preview
                    </span>
                  </div>
                )} */}
              </div>

              <div className="p-2">
                <h2 className="text-center text-lg font-medium">
                  {logo.title}
                </h2>
                <p className="text-sm text-gray-500 text-center">{logo.desc}</p>

                <div className="mt-4 flex justify-center gap-2">
                  {logo.isWaterMark ? (
                    <Button
                      onClick={() => handleRemoveWatermark(logo)}
                      className="bg-primary hover:bg-primary-dark w-full"
                      disabled={userDetail?.credits < 1}
                    >
                      {userDetail?.credits < 1
                        ? "Need Credits"
                        : `Remove Watermark (${userDetail?.credits} Left)`}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleDownload(logo)}
                      className="bg-green-600 hover:bg-green-700 w-full"
                      disabled={downloadingLogoId === logo.id}
                    >
                      {downloadingLogoId === logo.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Downloading...
                        </span>
                      ) : (
                        "Download"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default LogoList;
