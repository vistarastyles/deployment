import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return regex.test(email.trim());
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const cleanedEmail = email?.trim().toLowerCase();

    if (!isValidEmail(cleanedEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, cleanedEmail));

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You are already subscribed." },
        { status: 200 }
      );
    }

    await db.insert(newsletterSubscribers).values({ email: cleanedEmail });

    await resend.emails.send({
      from: "noreply@vistarastyles.com",
      to: cleanedEmail,
      subject: "Welcome to Our Newsletter!",
      html: `
  <div style="background-color: #f7f7f7; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
      <h1 style="color: #111827; font-size: 24px; margin-bottom: 12px;">🎉 Welcome to Vistara Styles!</h1>
      <p style="font-size: 16px; line-height: 1.6;">
        Thank you for subscribing to our newsletter. We're excited to have you on board!
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        You’ll be the first to know about <strong>exclusive offers</strong>, new arrivals, and weekly style inspiration.
      </p>
      
      <a href="https://vistarastyles.com/shop" 
         style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #facc15; color: #111827; text-decoration: none; font-weight: 600; border-radius: 6px;">
        Explore Now
      </a>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #888; text-align: center;">
        You received this email because you signed up on our website. You can unsubscribe at any time.
      </p>
    </div>
  </div>
`,
    });

    return NextResponse.json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error("[NEWSLETTER_SUBSCRIBE_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
