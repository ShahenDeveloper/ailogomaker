import React from "react";
import { Button, buttonVariants } from "../../components/ui/button";
import Link from "next/link";

export default function CustomLogoPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 p-6 font-sans">
      <div className="max-w-4xl mx-auto  bg-white p-8">
        <h1 className="text-3xl font-bold mb-4">
          Get a <span className="text-pink-600">First-Class Logo</span> Made Exclusively for Your Business
        </h1>
        <p className="mb-6">
          Don’t settle for ordinary — we offer <span className="text-pink-500">top-quality logo designs</span>. Just click below to get started!
        </p>

        {/* <a
          href="mailto:logomakersonlinehire@gmail.com"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded transition"
        >
          Get Started
        </a> */}
        <Link  href="mailto:logomakersonlinehire@gmail.com" className={buttonVariants()}>
            Get Started
        </Link>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Simple Process to Request a Custom Logo Design</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Select Logo Category & Industry:</strong> Choose your logo type and industry to stand out.
            </li>
            <li>
              <strong>Provide Your Requirements:</strong> Share your color, shape, or style preferences. We’ll match them.
            </li>
            <li>
              <strong>Give Us a Deadline:</strong> Let us know your deadline so we can meet it reliably.
            </li>
            <li>
              <strong>Get Your Custom Logo Design:</strong> Expect a thoughtful, unique logo that reflects your brand.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">Explore the Latest Custom Logos We’ve Delivered!</h2>
          <p className="text-sm text-gray-500">(Gallery section coming soon)</p>
        </section>

        <footer className="mt-10 border-t border-gray-200 pt-4">
          <p className="text-sm">
            📧 Contact:{" "}
            <a
              href="mailto:logomakersonlinehire@gmail.com"
              className="text-pink-500 hover:underline"
            >
              logomakersonlinehire@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
