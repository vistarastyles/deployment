import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs"; // If using Clerk
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  const { userId } = auth(); // Clerk user ID
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: "Login timestamp updated." }, { status: 200 });
  } catch (error) {
    console.error("Login update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
