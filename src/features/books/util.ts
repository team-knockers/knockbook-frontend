// Calculate discount rate (%) given original and discounted prices.
export function calculateBookDiscountRate(discountedPurchaseAmount: number, purchaseAmount: number): number {
  if (purchaseAmount <= 0) return 0;
  return Math.round((purchaseAmount - discountedPurchaseAmount) / purchaseAmount * 100);
}
