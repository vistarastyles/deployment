// app/api/razorpay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, carts, cartItems } from "@/db/schema";
import crypto from "crypto";
import { eq, and } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import { generateInvoicePdf } from "@/lib/generateInvoice";
import { uploadInvoice } from "@/lib/uploadInvoiceToSupabase";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";

export async function POST(req: NextRequest) {
  console.log("🔔 [Webhook] Incoming request URL:", req.url);

  // 1) Verify signature
  const rawBody = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  if (sig !== expected) {
    console.error("❌ Signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  if (payload.event !== "payment.captured") {
    console.log(`ℹ️ Ignoring event: ${payload.event}`);
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const payment = payload.payload.payment.entity;
  const userId = payment.notes.userId as string;
  const razorpayOrderId = payment.order_id as string;

  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.isActive, true)));

  const items = cart
    ? await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id))
    : [];

  await db
    .update(orders)
    .set({
      paymentId: payment.id,
      paymentStatus: "paid",
      shippingAddress: payment.notes.shippingAddress
        ? JSON.parse(payment.notes.shippingAddress)
        : null,
      items: items.map((i) => ({
        productId: i.productId,
        title: i.productTitle ?? "",
        price: Number(i.productSalePrice ?? 0),
        quantity: i.quantity,
        selectedSize: i.selectedSize ?? "",
        selectedColor: i.selectedColor ?? "",
      })),
    })
    .where(eq(orders.razorpayOrderId, razorpayOrderId));

  if (cart) {
    await db
      .update(carts)
      .set({ isActive: false })
      .where(eq(carts.id, cart.id));
  }

  const { users } = await clerkClient();
  const clerkUser = await users.getUser(userId);
  const userName = clerkUser.firstName ?? "Customer";
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
  if (!userEmail) {
    console.error("❌ No email found for user", userId);
    return NextResponse.json({ error: "No email for user" }, { status: 500 });
  }

  const [order] = await db
    .select({
      id: orders.id,
      items: orders.items,
    })
    .from(orders)
    .where(eq(orders.razorpayOrderId, razorpayOrderId));

  if (!order) {
    console.error("❌ Order not found for Razorpay ID", razorpayOrderId);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const invoiceOrder = {
    id: order.id,
    user: { name: userName },
    items: order.items,
  };
  const pdfBuffer = await generateInvoicePdf(invoiceOrder);

  const publicUrl = await uploadInvoice(order.id, pdfBuffer);
  console.log("✅ Invoice uploaded to:", publicUrl);

  await db
    .update(orders)
    .set({ invoiceUrl: publicUrl })
    .where(eq(orders.id, order.id));

  await sendInvoiceEmail({
    to: userEmail,
    name: userName,
    invoiceUrl: publicUrl,
  });
  console.log("📧 Invoice email sent to:", userEmail);

  return NextResponse.json({ ok: true }, { status: 200 });
}
