"use client";
import React from "react";
import { menuItems } from "./MenuItems";
import { Link } from "@/components/Shared";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-200">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-primary transition-colors duration-200"
              onClick={onClose}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileMenu;
