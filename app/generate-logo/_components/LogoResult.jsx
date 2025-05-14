"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button"; 

export const LogoResult = ({
  logoImage,
  onDownload,
  onRemoveWatermark,
  credits,
  subscription,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={logoImage} alt="Generated Logo" className="max-w-md" />
      
      <div className="flex gap-2">
        <Button onClick={onDownload}>Download Logo</Button>
        
        {onRemoveWatermark && (
          <Button variant="outline" onClick={onRemoveWatermark}>
            Remove Watermark (1 Credit)
          </Button>
        )}

        {subscription !== "free" && credits > 0 && (
          <Button
            variant="secondary"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard for Full Version
          </Button>
        )}
      </div>
    </div>
  );
};