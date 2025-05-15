"use client";
import { Button } from "../../../components/ui/button";
import { UserDetailContex } from "../../_context/UserDetailContext";
import { useContext } from "react";

export default function Info() {
  const { userDetail } = useContext(UserDetailContex);

  
  return (
    <div className="p-6 bg-muted/50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {userDetail?.planName?.toUpperCase() || "LOADING"} PLAN
          </h2>
          {userDetail?.nextRenewal && (
            <p className="text-sm text-muted-foreground">
              Renewal: {new Date(userDetail.nextRenewal).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">
            {userDetail?.credits || 0}
          </p>
          <p className="text-sm text-muted-foreground">Available Credits</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm">
          <span className="font-medium">Credits Used:</span> {userDetail?.usedCredits || 0}
        </p>
        {userDetail?.subscription !== "free" && (
          <Button variant="link" className="p-0 h-auto text-primary">
            Purchase More Credits
          </Button>
        )}
      </div>
    </div>
  );
}