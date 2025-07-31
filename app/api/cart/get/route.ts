// /app/api/cart/get/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems, carts, products, productImages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.isActive, true)));

  if (!cart) return NextResponse.json([], { status: 200 });

  const items = await db
    .select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      priceAtAddition: cartItems.priceAtAddition,
      productTitle: cartItems.productTitle,
      productSalePrice: cartItems.productSalePrice,
      selectedSize: cartItems.selectedSize,
      selectedColor: cartItems.selectedColor,
      createdAt: cartItems.createdAt,
      updatedAt: cartItems.updatedAt,
      basePrice: products.basePrice,
      imageUrl: productImages.url,
      slug: products.slug,
    })
    .from(cartItems)
    .leftJoin(products, eq(products.id, cartItems.productId))
    .leftJoin(
      productImages,
      and(
        eq(productImages.productId, cartItems.productId),
        eq(productImages.position, 1)
      )
    )
    .where(eq(cartItems.cartId, cart.id));

  return NextResponse.json(items, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
