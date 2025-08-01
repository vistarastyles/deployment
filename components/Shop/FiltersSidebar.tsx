"use client";
import React from "react";

interface FiltersSidebarProps {
  uniqueSizes: string[];
  uniqueColors: string[];
  selectedSize: string;
  selectedColor: string;
  priceRange: string;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  setPriceRange: (range: string) => void;
  setCurrentPage: (page: number) => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  uniqueSizes,
  uniqueColors,
  selectedSize,
  selectedColor,
  priceRange,
  setSelectedSize,
  setSelectedColor,
  setPriceRange,
  setCurrentPage,
}) => {
  return (
    <aside className="lg:w-64 space-y-6">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueSizes.map((size, index) => (
              <button
                key={`${size}-${index}`}
                onClick={() =>
                  setSelectedSize(selectedSize === size ? "" : size)
                }
                className={`px-3 py-1 rounded border transition-all ${
                  selectedSize === size
                    ? "bg-white text-black border-white"
                    : "border-gray-600 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                onClick={() =>
                  setSelectedColor(selectedColor === color ? "" : color)
                }
                className={`px-3 py-1 rounded border text-sm transition-all capitalize ${
                  selectedColor === color
                    ? "bg-white text-black border-white"
                    : "border-gray-600 hover:border-gray-400"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Price Range</h3>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="">All Prices</option>
            <option value="0-500">Under ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-1500">₹1000 - ₹1500</option>
            <option value="1500-999999">₹1500+</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSelectedSize("");
            setSelectedColor("");
            setPriceRange("");
            setCurrentPage(1);
          }}
          className="w-full py-2 text-center text-gray-400 hover:text-white border border-gray-600 rounded hover:border-gray-400 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
};
