// File: /app/api/invoice/[paymentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateInvoicePdf } from "@/lib/generateInvoice";
import { uploadInvoice } from "@/lib/uploadInvoiceToSupabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  const paymentId = params.paymentId;

  // 1) Fetch the order (including any previously-stored invoiceUrl)
  const [order] = await db
    .select({ id: orders.id, invoiceUrl: orders.invoiceUrl })
    .from(orders)
    .where(eq(orders.paymentId, paymentId));

  if (!order) {
    return new NextResponse("Order not found", { status: 404 });
  }

  // 2) If we already have a public URL, redirect there immediately
  if (order.invoiceUrl) {
    return NextResponse.redirect(order.invoiceUrl, 307);
  }

  // 3) Otherwise: generate, upload, save, then redirect

  // 3a) Regenerate PDF
  const pdfBuffer = await generateInvoicePdf({
    id: order.id,
    user: { name: "Customer" }, // or pull real name if you prefer
    items: [], // you could fetch items here if needed
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
