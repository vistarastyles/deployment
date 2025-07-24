import React from "react";
import { menuItems } from "./MenuItems";
import { Link } from "@/components/Shared";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function PcMenu() {
  const pathName = usePathname();

  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-8">
        {menuItems.map((item) => {
          const isActive = pathName === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 hover:text-primary hover:bg-gray-50/20",
                isActive ? "text-primary" : "text-white"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
