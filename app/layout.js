import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "./../components/ui/sonner";

const host_Grotesk = Host_Grotesk({
  subsets: ["latin"],
});

export const metadata = {
  title: "LogoMaker",
  description:
    "Create stunning logos instantly with our AI-powered logo maker. Fast, free, and fully customizable.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta
            name="google-site-verification"
            content="PAUk7bnRH4Q0FJcKPmHXEnAp_Ly_RfSEUgnGE3NOTSE"
          />
        </head>
        <body className={host_Grotesk.className}>
          <Provider>{children}</Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
