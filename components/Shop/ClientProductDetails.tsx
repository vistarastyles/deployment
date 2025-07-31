"use client";
import { AddToCartButton } from "@/components/AddToCartButton";
import Image from "next/image";
import React, { useState } from "react";
import Discount from "./Discount";

function formatPrice(price: number | string) {
  return Number(price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

type ClientProductDetailsProps = {
  product: Product;
  images: ProductImage[];
};

const ClientProductDetails: React.FC<ClientProductDetailsProps> = ({
  product,
  images,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  const sizes = Array.isArray(product.sizes)
    ? [...new Set((product.sizes as string[]).filter(Boolean))]
    : [];

  const colors = Array.isArray(product.colors)
    ? [...new Set(product.colors.filter(Boolean))]
    : [];

  const isAddToCartDisabled =
    (sizes.length > 0 && !selectedSize) ||
    (colors.length > 0 && !selectedColor);

  return (
    <>
      {/* Images */}
      <section className="space-y-4 flex flex-col items-center">
        <div className="w-full aspect-square bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
          {images.length ? (
            <Image
              src={images[mainImageIdx]?.url}
              alt={images[mainImageIdx]?.alt ?? product.title}
              width={600}
              height={600}
              className="object-contain w-full h-full"
              priority
            />
          ) : (
            <span className="text-lg text-zinc-400">No image available</span>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-2 w-full overflow-x-auto max-h-[100px] py-2 px-4 hide-scrollbar">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setMainImageIdx(idx)}
                className={`flex-shrink-0 rounded-lg border p-0.5 transition-transform duration-200 ${
                  mainImageIdx === idx
                    ? "border-yellow-400 scale-105"
                    : "border-zinc-700"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? product.title}
                  width={100}
                  height={100}
                  className="rounded object-cover max-h-[80px] w-16"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Details */}
      <section className="space-y-8 flex flex-col justify-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {product.title}
          </h1>

          <div className="flex gap-2 flex-wrap mb-2">
            {product.isNew && (
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">New</span>
            )}
            {product.isBestSeller && (
              <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-semibold">Best Seller</span>
            )}
            {product.isOnSale && (
              <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">Sale</span>
            )}
            {product.isFeatured && (
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">Featured</span>
            )}
          </div>

          <div className="flex items-end gap-4 mb-4">
            <span className="text-3xl font-bold text-white">
              ₹{formatPrice(product.salePrice ?? 0)}
            </span>
            {product.basePrice && (
              <span className="line-through text-lg text-zinc-500">
                ₹{formatPrice(product.basePrice)}
              </span>
            )}
            <Discount
              basePrice={Number(product.basePrice)}
              salePrice={Number(product.salePrice)}
            />
          </div>
        </div>

        <p className="text-zinc-300 text-lg leading-relaxed mb-4">{product.description}</p>

        {/* Sizes */}
        <div>
          <h3 className="font-semibold mb-2 text-zinc-200">Available Sizes</h3>
          <div className="flex gap-2 flex-wrap">
            {sizes.length ? (
              sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                    selectedSize === size
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-zinc-900 text-white border-zinc-400 hover:bg-zinc-800"
                  }`}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))
            ) : (
              <span className="text-zinc-400">No sizes available</span>
            )}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="font-semibold mb-2 text-zinc-200">Available Colors</h3>
          <div className="flex gap-2 flex-wrap items-center">
            {colors.length ? (
              colors.map((colorObj) => (
                <button
                  key={colorObj.name}
                  onClick={() => setSelectedColor(colorObj.name)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow transition-all ${
                    selectedColor === colorObj.name
                      ? "border-yellow-400 ring-2 ring-yellow-400"
                      : "border-zinc-400"
                  }`}
                  style={{ backgroundColor: colorObj.hex }}
                  title={colorObj.name}
                />
              ))
            ) : (
              <span className="text-zinc-400">No colors available</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <AddToCartButton
            productId={product.id}
            title={product.title}
            salePrice={product.salePrice}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            disabled={isAddToCartDisabled}
          />
        </div>
      </section>
    </>
  );
};

export default ClientProductDetails;
