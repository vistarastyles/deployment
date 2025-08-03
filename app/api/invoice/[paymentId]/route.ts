// app/api/invoice/[paymentId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateInvoicePdf } from "@/lib/generateInvoice";
import { uploadInvoice } from "@/lib/uploadInvoiceToSupabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const paymentId = segments[segments.length - 1];

  const [order] = await db
    .select({ id: orders.id, invoiceUrl: orders.invoiceUrl })
    .from(orders)
    .where(eq(orders.paymentId, paymentId));

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.invoiceUrl) {
    return NextResponse.redirect(order.invoiceUrl, 307);
  }

  const pdfBuffer = await generateInvoicePdf({
    id: order.id,
    user: { name: "Customer" },
    items: [],
  });

  // 3b) Upload to Supabase
  const publicUrl = await uploadInvoice(order.id, pdfBuffer);

  // 3c) Persist the URL back into your orders table
  await db
    .update(orders)
    .set({ invoiceUrl: publicUrl })
    .where(eq(orders.id, order.id));

  // 3d) Redirect the client to the newly‐uploaded PDF
  return NextResponse.redirect(publicUrl, 307);
}
