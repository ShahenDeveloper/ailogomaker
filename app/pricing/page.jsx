"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
// import { fetchPricingPlans } from "../generate-logo/action/fetchPricingForUsers";
import LemonSqueezyCheckout from "../generate-logo/_components/LemonSqueezy";
import { fetchPricingPlans } from "./actions/fetchPricingPlan";
import {seedPricingPlans} from "./actions/seedData"

export default function PricingPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const logoId = searchParams.get("logoId");

  const [pricingPlans, setPricingPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = user?.primaryEmailAddress?.emailAddress;

useEffect(() => {
    const loadPlans = async () => {
      try {
        const fetchedPlans = await fetchPricingPlans();
        setPricingPlans(fetchedPlans);
      } catch (err) {
        setError("Failed to load pricing plans");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    if (plan.name === "Free") {
      router.push("/dashboard");
      return;
    }
    setSelectedPlan(plan);
  };
  console.log("in pricing section:", logoId);

  if (loading) return <div className="text-center p-8">Loading plans...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>

      {!selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-center">{plan.name}</h3>
              <p className="text-2xl font-bold text-center my-4">
                {plan.price}
              </p>
              <p className="text-center mb-4">{plan.credits} Credits</p>

              <div className="space-y-3 mb-6">
                {Object.entries(plan.features).map(([feature, value], idx) => (
                  <div key={idx} className="flex items-center">
                    {typeof value === "boolean" ? (
                      value ? (
                        <span className="text-green-500 mr-2">✔</span>
                      ) : (
                        <span className="text-gray-400 mr-2">—</span>
                      )
                    ) : (
                      <span className="mr-2">•</span>
                    )}
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {isSignedIn ? (
                <Button
                  className="w-full"
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.name === "Free" ? "Current Plan" : "Select Plan"}
                </Button>
              ) : (
                <div className="w-full sm:w-auto">
                  <SignInButton
                    mode="modal"
                    fallbackRedirectUrl={logoId ? `${process.env.NEXT_PUBLIC_BASE_URL}/logo-success?logoId=${logoId}` : `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`}
                  >
                    <Button className="w-full">
                      {plan.name === "Free" ? "Current Plan" : "Select Plan"}
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <LemonSqueezyCheckout
            productId={selectedPlan.pricingId}
            email={email}
            planName={selectedPlan.name}
            logoId={logoId}
          />
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setSelectedPlan(null)}
          >
            Back to Plans
          </Button>
        </div>
      )}
    </div>
  );
}
