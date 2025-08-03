"use client";

import { AddToCartButton } from "@/components/AddToCartButton";
import { Image, Link } from "@/components/Shared";
import Discount from "@/components/Shop/Discount";
import { useState } from "react";

interface HomeProductCardProps {
  product: Product & {
    images: ProductImage[];
  };
}

export const HomeProductCard: React.FC<HomeProductCardProps> = ({
  product,
}) => {
  const {
    id,
    title,
    slug,
    salePrice,
    basePrice,
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
    <div className="relative w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow hover:shadow-xl transition-all duration-200">
      {/* Badges */}
      {(isNew || isBestSeller || isOnSale || isFeatured) && (
        <div className="absolute top-3 left-3 z-10 flex gap-1 flex-wrap max-w-[85%]">
          {isNew && (
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
              New
            </span>
          )}
          {isBestSeller && (
            <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold shadow">
              Best Seller
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
              Sale
            </span>
          )}
          {isFeatured && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
              Featured
            </span>
          )}
        </div>
      )}

      {/* Image */}
      <Link href={`/shop/product/${slug}`}>
        <div className="w-full h-56 bg-zinc-800 flex items-center justify-center overflow-hidden rounded-t-xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={256}
              height={224}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <span className="text-sm text-zinc-400">No image available</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 text-white space-y-2">
        <Link href={`/shop/product/${slug}`}>
          <h2 className="text-lg font-bold line-clamp-2 hover:text-yellow-400 transition-colors">
            {title}
          </h2>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-yellow-400">
              ₹{salePrice}
            </span>
            <span className="line-through text-xs text-zinc-500">
              ₹{basePrice}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Discount basePrice={+basePrice} salePrice={+salePrice} />
            {/* <p className="text-[1em] text-red-500">Off</p> */}
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
        {/* Quick Add to Cart */}
        <div className="mt-4">
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
