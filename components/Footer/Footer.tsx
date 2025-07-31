import React from "react";
import SocialLinks from "./SocialLinks";
import { Icons, Link, Image } from "@/components/Shared";
import FooterBottom from "./FooterBottom";
import Navigation from "./Navigation";
import CustomerCare from "./CustomerCare";
import Legal from "./Legal";
import AccountLinks from "./AccountLinks";
import PaymentMethods from "./PaymentMethods";

const Footer = () => {
  return (
    <footer className=" text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Link href="/">
                <Image
                  src={Icons.Logo}
                  className="mb-3"
                  alt="Logo"
                  width={110}
                  height={110}
                />
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Refined styles for the modern man. Discover premium fashion that
                combines comfort, quality, and contemporary design.
              </p>
            </div>

            {/* Social Media Links */}
            <SocialLinks />
          </div>
          {/* Navigation */}
          <Navigation />
          {/* Customer Care */}
          <CustomerCare />
          {/* Legal */}
          <Legal />
          {/* Account */}
          <AccountLinks />
        </div>
        {/* Extras Section */}
        <PaymentMethods />
      </div>
      {/* Footer Bottom */}
      <FooterBottom />
    </footer>
  );
};

export default Footer;
