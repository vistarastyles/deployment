import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages, collections } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const productList = await db
      .select()
      .from(products)
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .leftJoin(collections, eq(products.collectionId, collections.id))
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));

    const grouped = productList.reduce(
      (acc, row) => {
        const product = row.products;
        const image = row.product_images;

        if (!acc[product.id]) {
          acc[product.id] = {
            ...product,
            basePrice: Number(product.basePrice),
            salePrice: Number(product.salePrice),
            images: [],
          } as ProductWithImages;
        }

        if (image) acc[product.id].images.push(image);

        return acc;
      },
      {} as Record<string, ProductWithImages>
    );

    const result: ProductWithImages[] = Object.values(grouped);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PRODUCTS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
