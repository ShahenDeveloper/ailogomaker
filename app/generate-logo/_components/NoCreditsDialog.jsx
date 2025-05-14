"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export const NoCreditsDialog = ({ open, onOpenChange, logoId }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Out of Credits</DialogTitle>
          <DialogDescription>
            You don't have enough credits to generate/remove watermarks from
            logos.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Choose a plan to get more credits and unlock watermark-free logos:
          </p>

          <div className="mt-4 space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Basic Plan</h4>
              <p className="text-sm text-muted-foreground">
                300 credits - $5/month
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Standard Plan</h4>
              <p className="text-sm text-muted-foreground">
                1200 credits - $10/month
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Pro Plan</h4>
              <p className="text-sm text-muted-foreground">
                1800 credits - $15/month
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className={"flex flex-col gap-4"}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button asChild>
            <Link href={logoId ? `/pricing?logoId=${logoId}` : "/pricing"}>
              Get Credits
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
