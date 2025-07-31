import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { carts, cartItems } from "@/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ count: 0 }, { status: 200 });

  // Find the user's active cart
  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.isActive, true)));

  if (!cart) {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }

  // Sum the quantity of all items in the cart
  const items = await db
    .select({ quantity: cartItems.quantity })
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id));

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return NextResponse.json({ count }, { status: 200 });
}
