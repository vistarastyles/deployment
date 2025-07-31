import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages, collections } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Query only products where isActive is true
    const productList = await db
      .select()
      .from(products)
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .leftJoin(collections, eq(products.collectionId, collections.id))
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));

    const grouped = productList.reduce((acc, row) => {
      const product = row.products;
      const image = row.product_images;
      const collection = row.collections;

      if (!acc[product.id]) {
        acc[product.id] = {
          ...product,
          images: [],
          collection,
        };
      }

      if (image) acc[product.id].images.push(image);

      return acc;
    }, {} as Record<string, any>);

    const result = Object.values(grouped);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PRODUCTS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
