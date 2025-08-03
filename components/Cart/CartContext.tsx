// components/Cart/CartContext.tsx
"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

type CartContextType = {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCartCount: async () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const res = await fetch("/api/cart/count", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.count ?? 0);
      }
    } catch {
      setCartCount(0);
    }
  }, []);
 
  React.useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
