import React from "react";

interface DiscountProps {
  basePrice?: number;
  salePrice?: number;
}

const calculateDiscount = (basePrice: number, salePrice: number): string => {
  if (basePrice <= 0 || salePrice >= basePrice) return "0%";
  const discount = ((basePrice - salePrice) / basePrice) * 100;
  return `-${Math.round(discount)}%`;
};

const Discount: React.FC<DiscountProps> = ({ basePrice, salePrice }) => {
  if (basePrice === undefined || salePrice === undefined) {
    return null;
  }

  return (
    <p className="text-red-600 text-lg ">
      {calculateDiscount(basePrice, salePrice)}
    </p>
  );
};

export default Discount;
