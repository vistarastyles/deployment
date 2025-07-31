import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ClientProductDetails from "@/components/Shop/ClientProductDetails";

interface Props {
  params: { slug: string };
}

export default async function ProductPage({ params }: Props) {
  const slug = params.slug;

  const [rawProduct] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));

  if (!rawProduct) return notFound();

  const rawImages = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, rawProduct.id));

  const product: Product = {
    ...rawProduct,
    basePrice: Number(rawProduct.basePrice),
    salePrice: Number(rawProduct.salePrice),
    sizes: (rawProduct.sizes as string[]) ?? [],
    colors: (rawProduct.colors as Color[]) ?? [],
  };

  const images: ProductImage[] = rawImages.map((image) => ({
    ...image,
    position: image.position ?? 0,
    alt: image.alt ?? "Product image",
    color: image.color ?? undefined,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 bg-zinc-950/80 rounded-2xl shadow-2xl p-8">
        <ClientProductDetails
          product={product}
          images={images}
          key={product.id}
        />
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));

  if (!product) return { title: "Product not found" };

  return {
    title: product.metaTitle ?? product.title,
    description: product.metaDescription ?? product.description,
  };
}
