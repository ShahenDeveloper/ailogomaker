'use client';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { fetchPricingPlansForAdmins, updatePricingPlan } from "./action";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { seedPricingPlans } from "./seedData";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPricingPage() {
  const { user } = useUser();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingPlanId, setUpdatingPlanId] = useState(null);
  const router = useRouter()

  useEffect(() => {
    seedPricingPlans()
    const seedAndLoadPlans = async () => {
      try {
        const fetchedPlans = await fetchPricingPlansForAdmins();
        setPlans(fetchedPlans);
      } catch (error) {
        if (error.message === "UNAUTHORIZED") {
          router.push("/404");
          return;
        }
        toast.error("Failed to load pricing plans");
        console.error("Error loading plans:", error);
      } finally {
        setLoading(false);
      }
    };
    seedAndLoadPlans();
  }, [router]);

  const handlePriceChange = (planId, newPrice) => {
    setPlans(prev =>
      prev.map(plan =>
        plan.id === planId ? { ...plan, price: newPrice } : plan
      )
    );
  };

  const handleUpdate = async (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    try {
      setUpdatingPlanId(planId);
      await updatePricingPlan(planId, { price: plan.price });
      toast.success('Plan updated successfully');
    } catch (error) {
      toast.error('Failed to update plan');
    } finally {
      setUpdatingPlanId(null);
    }
  };

  if (loading) return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
        <p className="text-gray-600 mt-2">Manage subscription plans and pricing</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor={`price-${plan.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Price
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <Input
                    id={`price-${plan.id}`}
                    type="text"
                    value={plan.price} // Set the default value from the fetched plan price
                    onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                    className="pl-7 pr-16 py-2"
                    min="0"
                    step="0.01"
                    disabled={updatingPlanId === plan.id}
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleUpdate(plan.id)}
                className="w-full"
                disabled={updatingPlanId === plan.id}
              >
                {updatingPlanId === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating
                  </>
                ) : (
                  "Update Plan"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}