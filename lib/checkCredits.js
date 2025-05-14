export async function checkCredits(user) {
  // Reset credits if it's a new month
  const lastReset = new Date(user.lastResetDate);
  const now = new Date();
  if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
    await updateDoc(doc(db, "users", user.email), {
      paidCredits: user.subscriptionPlan?.creditsPerMonth || 0,
      lastResetDate: now.toISOString()
    });
  }

  const availableCredits = user.subscriptionPlan?.name === "Free" 
    ? user.freeCredits 
    : user.paidCredits;

  if (availableCredits < 1) {
    throw new Error("Insufficient credits");
  }
}