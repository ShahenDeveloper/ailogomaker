"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { downloadLogo } from "../../logo-success/action/downloadLogoAction";

export const LogoResult = ({
  logoImage,
  onDownload,
  onRemoveWatermark,
  credits,
  subscription,
  logoId,
  email,
}) => {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (subscription === "free" && credits < 1) {
      router.push("/pricing");
      return;
    }

    setIsDownloading(true);
    try {
      const base64Zip = await downloadLogo(logoId, email);

      const link = document.createElement("a");
      link.href = `data:application/zip;base64,${base64Zip}`;
      link.download = `logo.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download logo. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={logoImage} alt="Generated Logo" className="max-w-md" />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onDownload}>
          Preview Logo
        </Button>

        {(credits > 0 || subscription !== "free") && (
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? "Downloading..." : "Download High-Quality Logo"}
          </Button>
        )}

        {onRemoveWatermark && (
          <Button
            variant="outline"
            onClick={() => {
              onRemoveWatermark();
            }}
          >
            Remove Watermark (1 Credit)
          </Button>
        )}
      </div>
    </div>
  );
};
