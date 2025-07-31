"use client";
import Image from "next/image";
import React, { useState } from "react";
import { AddToCartButton } from "../AddToCartButton";
import { Link } from "@/components/Shared";
import Discount from "./Discount";

interface ProductCardProps {
  product: Product & {
    images: ProductImage[];
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    id,
    title,
    salePrice,
    basePrice,
    slug,
    sizes = [],
    colors = [],
    images = [],
    isNew,
    isBestSeller,
    isOnSale,
    isFeatured,
  } = product;

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const isAddToCartDisabled =
    (sizes.length > 0 && !selectedSize) ||
    (colors.length > 0 && !selectedColor);

  const imageUrl = images[0]?.url || "";

  const cleanedSizes = [...new Set(sizes.filter(Boolean))];
  const cleanedColors = [...new Set(colors.filter(Boolean))];

  return (
    <div className="relative w-80 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 group">
      {/* Badges */}
      {(isNew || isBestSeller || isOnSale || isFeatured) && (
        <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap max-w-[90%]">
          {isNew && (
            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
              New
            </span>
          )}
          {isBestSeller && (
            <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-semibold shadow">
              Best Seller
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
              Sale
            </span>
          )}
          {isFeatured && (
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
              Featured
            </span>
          )}
        </div>
      )}

      {/* Image */}
      <Link href={`/shop/product/${slug}`} className="block w-full h-64">
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={318}
              height={256}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <span className="text-sm text-zinc-400">No image available</span>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="text-white p-5 space-y-4">
        <div>
          <h1 className="text-lg font-bold line-clamp-2 mb-2 hover:text-yellow-400 transition-colors">
            <Link href={`/shop/product/${slug}`}>{title}</Link>
          </h1>

          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-yellow-400">
                ₹{salePrice}
              </span>
              <span className="line-through text-sm text-zinc-400">
                ₹{basePrice}
              </span>
            </div>
            <Discount
              basePrice={Number(basePrice)}
              salePrice={Number(salePrice)}
            />
          </div>
        </div>

        {/* Size */}
        {cleanedSizes.length > 0 && (
          <div className="flex gap-2 flex-col">
            <label className="text-sm font-medium text-zinc-300">Size</label>
            <div className="flex gap-2 flex-wrap">
              {cleanedSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-200 ${
                    selectedSize === size
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        {cleanedColors.length > 0 && (
          <div className="flex gap-2 flex-col">
            <label className="text-sm font-medium text-zinc-300">Color</label>
            <div className="flex gap-2 flex-wrap">
              {cleanedColors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color.name);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color.name
                      ? "border-yellow-400 shadow-lg"
                      : "border-zinc-600 hover:border-zinc-500"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor === color.name && (
                    <div className="w-full h-full rounded-full border-2 border-black/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div onClick={(e) => e.stopPropagation()}>
          <AddToCartButton
            productId={id}
            title={title}
            salePrice={salePrice}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            disabled={isAddToCartDisabled}
          />
        </div>
      </div>
    </div>
  );
};
