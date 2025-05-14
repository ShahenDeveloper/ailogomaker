import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";

const Footer = () => {
  return (
    <section className="bg-gray-50 py-12 mt-32 w-full border-t">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Instantly Generate Stunning Logos with AI
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed dark:text-gray-400">
              Say goodbye to generic designs. Create unique, professional logos in seconds with our AI-powered logo generator.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <Button
              size={"lg"}
              variant={"link"}
              className="w-full min-[400px]:w-auto bg-gradient-to-r from-slate-900 to-rose-500 hover:to-slate-900 hover:text-white text-white transition-all duration-300"
            >
              <Link
                className="flex items-center justify-center px-6 py-6"
                href="/create?title="
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-5 animate-pulse" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-12 text-center text-sm text-gray-500 flex flex-wrap justify-center gap-6">
          <Link href="/faq" className="hover:underline">
            FAQ
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:underline">
            Refund Policy
          </Link>
          <Link href="/terms-and-policy" className="hover:underline">
            Terms & Policy
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Footer;
