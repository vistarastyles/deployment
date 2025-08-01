import React from "react";
import { accountLinks, Link } from "@/components/Shared";

export default function AccountLinks() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">Account</h3>
      <ul className="space-y-3">
        {accountLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className="flex items-center text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
