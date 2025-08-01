// /lib/createOrder.ts

import type { ShippingAddress } from "../app/api/razorpay/create-order/route";

export async function createRazorpayOrder(
  shippingAddress: ShippingAddress
): Promise<{ orderId: string; amount: number; currency: string }> {
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shippingAddress }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create Razorpay order");
  }

  return await res.json();
}
