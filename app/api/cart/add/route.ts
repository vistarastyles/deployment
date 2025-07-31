// /app/api/cart/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { carts, cartItems, products } from "@/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const {
      productId,
      quantity = 1,
      title,
      salePrice,
      selectedSize,
      selectedColor,
    } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Ensure product exists
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Ensure user cart exists or create one
    let [cart] = await db
      .select()
      .from(carts)
      .where(and(eq(carts.userId, userId), eq(carts.isActive, true)));
    if (!cart) {
      const [newCart] = await db.insert(carts).values({ userId }).returning();
      cart = newCart;
    }

    // Add or update cart item
    const existing = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart.id),
          eq(cartItems.productId, productId),
          selectedSize
            ? eq(cartItems.selectedSize, selectedSize)
            : isNull(cartItems.selectedSize),
          selectedColor
            ? eq(cartItems.selectedColor, selectedColor)
            : isNull(cartItems.selectedColor)
        )
      );

    if (existing.length > 0) {
      await db
        .update(cartItems)
        .set({
          quantity: existing[0].quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existing[0].id));
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId,
        quantity,
        priceAtAddition: salePrice ?? product.salePrice ?? product.basePrice,
        productTitle: title ?? product.title,
        productSalePrice: salePrice ?? product.salePrice ?? product.basePrice,
        selectedSize: selectedSize || null,
        selectedColor: selectedColor || null,
      });
    }

    return NextResponse.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
