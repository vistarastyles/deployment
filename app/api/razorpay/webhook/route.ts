// /app/api/razorpay/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, carts, cartItems } from "@/db/schema";
import crypto from "crypto";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  // 1) Read and verify signature
  const rawBody = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  if (sig !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2) Parse payload
  const payload = JSON.parse(rawBody);
  if (payload.event !== "payment.captured") {
    // We only handle successful payments here
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 3) Extract payment and cart info
  const payment = payload.payload.payment.entity;
  const userId = payment.notes.userId as string;
  const razorpayOrderId = payment.order_id as string;

  // 4) Find the user’s active cart
  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.isActive, true)));
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  // 5) Fetch cart items
  const items = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id));

  // 6) Insert the completed order record
  await db.insert(orders).values({
    userId,
    razorpayOrderId,
    paymentId: payment.id,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    amount: payment.amount / 100, // back to rupees
    shippingAddress: payment.notes.shippingAddress
      ? JSON.parse(payment.notes.shippingAddress)
      : null,
    items: items.map((item) => ({
      productId: item.productId,
      title: item.productTitle,
      price: item.productSalePrice,
      quantity: item.quantity,
      selectedSize: item.selectedSize ?? "",
      selectedColor: item.selectedColor ?? "",
    })),
  });

  // 7) Deactivate the cart
  await db.update(carts).set({ isActive: false }).where(eq(carts.id, cart.id));

  return NextResponse.json({ ok: true }, { status: 200 });
}
