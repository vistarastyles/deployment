import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    phone_numbers?: { phone_number: string }[];
    username?: string;
    first_name?: string;
  };
}

export async function GET() {
  return new Response("GET route works", { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const headerList = await headers();

    if (!WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing Clerk webhook secret" },
        { status: 400 }
      );
    }

    const svix = new Webhook(WEBHOOK_SECRET);

    const svixHeaders = {
      "svix-id": headerList.get("svix-id") ?? "",
      "svix-timestamp": headerList.get("svix-timestamp") ?? "",
      "svix-signature": headerList.get("svix-signature") ?? "",
    };

    const event = svix.verify(payload, svixHeaders) as ClerkUserCreatedEvent;

    console.log("✅ Clerk Webhook Event:", event.type);

    // We only want to handle user.created events
    if (event.type !== "user.created") {
      return NextResponse.json({ message: "Event ignored." }, { status: 200 });
    }

    const user = event.data;

    const email = user.email_addresses?.[0]?.email_address;
    const phone = user.phone_numbers?.[0]?.phone_number;

    if (!email || !user.id) {
      return NextResponse.json(
        { error: "Missing user ID or email in payload" },
        { status: 400 }
      );
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    await db.insert(users).values({
      id: user.id,
      email,
      name: user.username || user.first_name || "user",
      phone: phone || null,
      role: "user",
      provider: "clerk",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      deletedAt: null,
    });

    return NextResponse.json(
      { message: "✅ User created in DB" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook verification or insert failed" },
      { status: 400 }
    );
  }
}
