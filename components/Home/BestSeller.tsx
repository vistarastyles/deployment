"use client";
import { useEffect, useState } from "react";
import { HomeProductCard } from "./HomeProductCard";

export default function BestSeller() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: ProductWithImages[]) => {
        const bestSellers = data.filter((p) => p.isBestSeller);
        setProducts(bestSellers);
      });
  }, []);
  return (
    <section className="mt-12 mb-4 px-4 md:px-8 lg:px-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        Best Selling Products
      </h2>
      <div className="flex flex-wrap gap-6">
        {products.map((product) => (
          <HomeProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
