"use client";
import { useEffect, useState } from "react";

const StripeCheckout = ({ email, planName, logoId, productId }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function go() {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, planName, logoId, productId }),
      });
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    }
    go();
  }, [email, planName, logoId]);

  return loading ? (
    <div className="p-4 text-center">Loading Stripe…</div>
  ) : null;
};

export default StripeCheckout;
