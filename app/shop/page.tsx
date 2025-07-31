"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Shop/Header";
import { FiltersSidebar } from "@/components/Shop/FiltersSidebar";
import { ProductGrid } from "@/components/Shop/ProductGrid";
import { Pagination } from "@/components/Shop/Pagination";

export type ProductWithImages = Product & { images: ProductImage[] };

export default function MensTShirtShop() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: ProductWithImages[]) => setProducts(data))
      .catch(console.error);
  }, []);

  // 1) Filter
  let filtered = products.filter((p) => {
    if (selectedSize && !p.sizes.includes(selectedSize)) return false;
    if (
      selectedColor &&
      !p.colors.some(
        (color) => color.name.toLowerCase() === selectedColor.toLowerCase()
      )
    )
      return false;

    if (priceRange && p.salePrice !== null) {
      const [min, max] = priceRange.split("-").map(Number);
      const sp = parseFloat(String(p.salePrice));
      if (sp < min || sp > max) return false;
    }
    return true;
  });

  // 2) Sort
  filtered = filtered.sort((a, b) => {
    const aPrice = a.salePrice !== null ? parseFloat(String(a.salePrice)) : 0;
    const bPrice = b.salePrice !== null ? parseFloat(String(b.salePrice)) : 0;

    switch (sortOption) {
      case "priceLowToHigh":
        return aPrice - bPrice;
      case "priceHighToLow":
        return bPrice - aPrice;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return 0;
    }
  });

  // 3) Pagination
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Sidebar filters
  const uniqueSizes = Array.from(
    new Set(products.flatMap((p) => p.sizes))
  ).sort();
  const uniqueColors = Array.from(
    new Set(products.flatMap((p) => p.colors.map((c) => c.name)))
  ).sort();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        sortOption={sortOption}
        setSortOption={(opt) => {
          setSortOption(opt);
          setCurrentPage(1);
        }}
      />

      <div className="mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <FiltersSidebar
          uniqueSizes={uniqueSizes}
          uniqueColors={uniqueColors}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          priceRange={priceRange}
          setSelectedSize={(size) => {
            setSelectedSize(size);
            setCurrentPage(1);
          }}
          setSelectedColor={(color) => {
            setSelectedColor(color);
            setCurrentPage(1);
          }}
          setPriceRange={(range) => {
            setPriceRange(range);
            setCurrentPage(1);
          }}
          setCurrentPage={setCurrentPage}
        />

        <div className="flex-1 flex flex-col">
          <ProductGrid products={paginated} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
