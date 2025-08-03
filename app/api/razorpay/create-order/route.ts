import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/db";
import { carts, cartItems, orders } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

export interface ShippingAddress {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  city: string;
  zip: string;
  province?: string;
  country_code: string;
}

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("🚀 RAZORPAY_KEY_ID:", keyId);
console.log("🚀 RAZORPAY_KEY_SECRET:", keySecret ? "[REDACTED]" : undefined);

if (!keyId || !keySecret) {
  throw new Error(
    "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment"
  );
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.isActive, true)));
  if (!cart) {
    return NextResponse.json({ error: "No active cart" }, { status: 404 });
  }

  const items = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id));
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart empty" }, { status: 400 });
  }

  const totalAmount = items.reduce(
    (sum, i) => sum + Number(i.productSalePrice) * i.quantity,
    0
  );

  // razorpay receipt must be ≤40 chars
  const receiptId = `r_${cart.id}`.slice(0, 40);

  const rpOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: receiptId,
    notes: {
      userId,
    },
  });

  await db.insert(orders).values({
    userId,
    razorpayOrderId: rpOrder.id,
    paymentMethod: "razorpay",
    paymentStatus: "pending",
    amount: totalAmount.toString(),
    items: [],
  });

  return NextResponse.json(
    {
      orderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
    },
    { status: 200 }
  );
}
