// lib/sendInvoiceEmail.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendInvoiceEmail({
  to,
  name,
  invoiceUrl,
}: {
  to: string;
  name: string;
  invoiceUrl: string;
}) {
  await resend.emails.send({
    from: "Vistara Styles <noreply@vistarastyles.com>",
    to,
    subject: "Your Invoice from Vistara Styles",
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for your purchase!</p>
      <p><a href="${invoiceUrl}">Download your invoice here</a></p>
    `,
  });
}
