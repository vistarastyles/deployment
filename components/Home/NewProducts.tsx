"use client";
import { useEffect, useState } from "react";
import { HomeProductCard } from "./HomeProductCard";

export default function NewProducts() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: ProductWithImages[]) => {
        const newProducts = data.filter((p) => p.isNew);
        setProducts(newProducts);
      });
  }, []);

  return (
    <section className="my-6 px-4 md:px-8 lg:px-12">
      <h2 className="text-2xl font-bold text-white mb-6">Featured Products</h2>
      <div className="flex flex-wrap gap-6">
        {products.map((product) => (
          <HomeProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
