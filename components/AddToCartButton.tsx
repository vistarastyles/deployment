"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/Cart/CartContext";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  title?: string;
  salePrice?: number | string;
  selectedSize?: string | null;
  selectedColor?: string | null;
  disabled?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  className,
  title,
  salePrice,
  selectedSize,
  selectedColor,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);
  const { refreshCartCount } = useCart();

  const handleAddToCart = async () => {
    if (disabled) {
      alert("Please select a size and color before adding to cart.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity,
          title,
          salePrice,
          selectedSize,
          selectedColor,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      toast.success("Added to cart");
      await refreshCartCount();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error adding to cart");
      } else {
        toast.error("Error adding to cart");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleAddToCart}
      className={`bg-white text-black py-3 rounded-md cursor-pointer hover:bg-yellow-500 font-semibold hover:text-white transition-all duration-200 ease-in flex items-center justify-center gap-4 w-full ${className}`}
    >
      <ShoppingCart size={18} />
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};
