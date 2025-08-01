"use client";
import React from "react";
import { ProductCard } from "@/components/Shop/ProductCard";

interface ProductGridProps {
  products: (Product & { images: ProductImage[] })[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="w-full text-center py-10 text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-6 px-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
