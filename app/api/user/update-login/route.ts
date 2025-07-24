import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json(
      { message: "Login timestamp updated." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
