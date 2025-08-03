// lib/generateInvoice.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type OrderItem = {
  productId: string;
  title: string;
  price: number; // price inclusive of GST
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

type Order = {
  id: string;
  user: {
    name: string;
  };
  items: OrderItem[];
};

export async function generateInvoicePdf(order: Order): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header
  page.drawText("Vistara Styles", {
    x: 50,
    y: 770,
    size: 20,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText("INVOICE", {
    x: 470,
    y: 770,
    size: 18,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Order & Customer Info
  page.drawText(`Order ID: ${order.id}`, {
    x: 50,
    y: 740,
    size: 12,
    font: helvetica,
  });
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: 300,
    y: 740,
    size: 12,
    font: helvetica,
  });
  page.drawText(`Bill To: ${order.user.name}`, {
    x: 50,
    y: 720,
    size: 12,
    font: helvetica,
  });

  // Table Header
  const tableTop = 680;
  const cols = [50, 300, 420];
  page.drawLine({
    start: { x: 50, y: tableTop + 5 },
    end: { x: 550, y: tableTop + 5 },
    thickness: 1,
  });
  page.drawText("Item Description", {
    x: cols[0],
    y: tableTop,
    size: 12,
    font: helveticaBold,
  });
  page.drawText("Qty", {
    x: cols[1],
    y: tableTop,
    size: 12,
    font: helveticaBold,
  });
  page.drawText("Amount", {
    x: cols[2],
    y: tableTop,
    size: 12,
    font: helveticaBold,
  });
  page.drawLine({
    start: { x: 50, y: tableTop - 2 },
    end: { x: 550, y: tableTop - 2 },
    thickness: 1,
  });

  // Table Rows
  let y = tableTop - 20;
  let total = 0;
  order.items.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    page.drawText(item.title, { x: cols[0], y, size: 11, font: helvetica });
    page.drawText(String(item.quantity), {
      x: cols[1],
      y,
      size: 11,
      font: helvetica,
    });
    page.drawText(`Rs${lineTotal.toFixed(2)}`, {
      x: cols[2],
      y,
      size: 11,
      font: helvetica,
    });
    y -= 18;
  });

  // Total
  page.drawLine({
    start: { x: 300, y: y - 10 },
    end: { x: 550, y: y - 10 },
    thickness: 1,
  });
  page.drawText("Total:", { x: 380, y: y - 30, size: 14, font: helveticaBold });
  page.drawText(`Rs${total.toFixed(2)}`, {
    x: 480,
    y: y - 30,
    size: 14,
    font: helveticaBold,
  });

  // Footer
  page.drawLine({
    start: { x: 50, y: 80 },
    end: { x: 550, y: 80 },
    thickness: 1,
  });
  page.drawText("Thank you for shopping with Vistara Styles!", {
    x: 50,
    y: 60,
    size: 12,
    font: helvetica,
  });
  page.drawText("contactus@vistarastyles.com | +91 76239 69483", {
    x: 50,
    y: 45,
    size: 10,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
