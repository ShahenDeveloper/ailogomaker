"use client";
import { useEffect, useState } from "react";

const LemonSqueezyCheckout = ({ productId, email, planName,logoId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createCheckout = async () => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            email,
            planName,
            logoId
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout");
        }

        const data = await response.json();
        window.location.href = data.checkoutUrl;
      } catch (err) {
        setError(err.message);
        console.error("Checkout error:", err);
      } finally {
        setLoading(false);
      }
    };

    createCheckout();
  }, [productId, email, planName]);

  if (loading) {
    return <div className="p-4 text-center">Loading checkout...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error: {error}. Please try again.
      </div>
    );
  }

  return null;
};

export default LemonSqueezyCheckout;