"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Icons, Link } from "../Shared";
import { useAuth, UserButton } from "@clerk/nextjs";

interface Props {
  cartCount?: number;
  className?: string;
}

const CartAccountIcons: React.FC<Props> = ({ cartCount = 0, className }) => {
  const { isSignedIn } = useAuth();
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <Link
        href="/cart"
        className="relative p-2 text-white hover:text-primary cursor-pointer hover:bg-gray-50 rounded-full transition-colors duration-200"
      >
        <Icons.ShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {cartCount}
          </span>
        )}
      </Link>
      {isSignedIn ? (
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Home"
              labelIcon={<Icons.Home className="h-4 w-4" />}
              href="/"
            />
            <UserButton.Link
              label="Cart"
              labelIcon={<Icons.ShoppingCart className="h-4 w-4" />}
              href="/cart"
            />
          </UserButton.MenuItems>
        </UserButton>
      ) : (
        <Link
          href={"/account"}
          className="p-2 text-white hover:text-primary cursor-pointer hover:bg-gray-50 rounded-full transition-colors duration-200"
        >
          <Icons.User className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
};

export default CartAccountIcons;
