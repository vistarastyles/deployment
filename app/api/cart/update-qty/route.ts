import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

export async function PATCH(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { itemId, action } = body;

  if (!itemId || !["increment", "decrement", "delete"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    if (action === "delete") {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
      return NextResponse.json({ success: true, deleted: true });
    }

    const [item] = await db
      .select({ quantity: cartItems.quantity })
      .from(cartItems)
      .where(eq(cartItems.id, itemId));

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    let newQty = item.quantity;
    if (action === "increment") newQty += 1;
    if (action === "decrement") newQty = Math.max(1, newQty - 1); // Don't go below 1

    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, itemId));

    return NextResponse.json({ success: true, updatedQty: newQty });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
