import {
  Home,
  Store,
  Phone,
  Info,
  User,
  ShoppingCart,
  X,
  Menu,
  Instagram,
  Facebook,
  Twitter,
  Truck,
  RotateCcw,
  Package,
  Ruler,
  HelpCircle,
  Shield,
  FileText,
  RefreshCw,
  Cookie,
  LogIn,
  ShoppingBag,
  Heart,
  Youtube,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import logo from "@/public/logo.png";
import upi from "@/public/upi-logo.webp";
import visa from "@/public/visa-logo.webp";
import mastercard from "@/public/mastercard-logo.webp";

export const Icons = {
  Home,
  Store,
  Phone,
  Info,
  Logo: logo,
  User,
  ShoppingCart,
  X,
  Menu,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Truck,
  RotateCcw,
  Package,
  Ruler,
  HelpCircle,
  Shield,
  FileText,
  RefreshCw,
  Cookie,
  LogIn,
  ShoppingBag,
  Heart,
  UPI: upi,
  Visa: visa,
  MasterCard: mastercard,
  Minus,
  Plus,
  ArrowLeft,
};

export type IconName = keyof typeof Icons;

export { default as Link } from "next/link";
export { default as Image } from "next/image";

export const socialLinks = [
  {
    name: "Instagram",
    icon: Icons.Instagram,
    href: "https://www.instagram.com/vistarastyles/",
    color: "hover:text-pink-500",
  },
  {
    name: "Facebook",
    icon: Icons.Facebook,
    href: "https://www.facebook.com/vistarastyles",
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    icon: Icons.Twitter,
    href: "https://x.com/vistarastyles",
    color: "hover:text-blue-400",
  },
  {
    name: "Youtube",
    icon: Icons.Youtube,
    href: "https://www.youtube.com/@vistarastyles",
    color: "hover:text-red-700",
  },
];

export const navigationLinks = [
  { name: "Home", icon: Icons.Home, href: "/" },
  { name: "Shop", icon: Icons.Store, href: "/shop" },
  { name: "About Us", icon: Icons.Info, href: "/about" },
  { name: "Contact", icon: Icons.Phone, href: "/contact" },
];

export const customerCareLinks = [
  { name: "Shipping & Delivery", icon: Icons.Truck, href: "/shipping" },
  { name: "Returns & Exchanges", icon: Icons.RotateCcw, href: "/returns" },
  { name: "Order Tracking", icon: Icons.Package, href: "/track-order" },
  { name: "Size Guide", icon: Icons.Ruler, href: "/size-guide" },
  { name: "FAQs", icon: Icons.HelpCircle, href: "/faqs" },
];

export const legalLinks = [
  { name: "Privacy Policy", icon: Icons.Shield, href: "/privacy" },
  { name: "Terms & Conditions", icon: Icons.FileText, href: "/terms" },
  { name: "Refund Policy", icon: Icons.RefreshCw, href: "/refund" },
  { name: "Cookie Policy", icon: Icons.Cookie, href: "/cookies" },
];

export const accountLinks = [
  { name: "Login / Register", icon: Icons.LogIn, href: "/sign-in" },
  { name: "My Account", icon: Icons.User, href: "/account" },
  { name: "Orders", icon: Icons.ShoppingBag, href: "/account/orders" },
  { name: "Wishlist", icon: Icons.Heart, href: "/account/wishlist" },
];

export const paymentMethods = [
  { name: "Visa", logo: Icons.Visa },
  { name: "MasterCard", logo: Icons.MasterCard },
  { name: "UPI", logo: Icons.UPI },
];
