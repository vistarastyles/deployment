"use client";
import React from "react";

interface SortingToolbarProps {
  sortOption: string;
  setSortOption: (value: string) => void;
}

export function SortingToolbar({ sortOption, setSortOption }: SortingToolbarProps) {
  return (
    <div className="flex justify-end px-4 lg:px-8 pb-4">
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="bg-gray-900 text-white border border-gray-700 px-4 py-2 rounded"
      >
        <option value="newest">Newest</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
      </select>
    </div>
  );
}