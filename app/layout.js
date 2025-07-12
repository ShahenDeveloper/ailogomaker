import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "./../components/ui/sonner";

const host_Grotesk = Host_Grotesk({
  subsets: ["latin"],
});

export const metadata = {
  title: "Badge Bloom",
  description:
    "Create stunning logos instantly with our AI-powered logo maker. Fast, free, and fully customizable.",
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/images/favicon.ico" sizes="any" />

          <meta
            name="google-site-verification"
            content="PAUk7bnRH4Q0FJcKPmHXEnAp_Ly_RfSEUgnGE3NOTSE"
          />
          <meta name="robots" content="index, follow" />
        </head>
        <body className={host_Grotesk.className}>
          <Provider>{children}</Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
