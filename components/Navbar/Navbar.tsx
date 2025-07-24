"use client";

import React, { useState } from "react";
import PcMenu from "./PcMenu";
import Logo from "./Logo";
import CartAccountIcons from "./CartAccountIcons";
import MobileMenu from "./MobileMenu"; // ✅ imported mobile menu
import { Icons } from "@/components/Shared";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="shadow-lg border-b border-gray-200 sticky top-0 z-50 bg-black/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <PcMenu />

          {/* Desktop Cart and Account Icons */}
          <CartAccountIcons className="hidden md:flex" cartCount={3} />

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-4">
            <CartAccountIcons className="flex md:hidden" cartCount={3} />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-white cursor-pointer focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <Icons.X className="h-6 w-6" />
              ) : (
                <Icons.Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
