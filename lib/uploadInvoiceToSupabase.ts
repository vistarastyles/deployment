// lib/uploadInvoiceToSupabase.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
);

export async function uploadInvoice(orderId: string, buffer: Buffer) {
  const filePath = `invoices/${orderId}.pdf`;

  const { error } = await supabase.storage
    .from("invoices")
    .upload(filePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from("invoices").getPublicUrl(filePath);
  return data.publicUrl;
}
