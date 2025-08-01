// types/global.d.ts
export {};

declare global {
  // ===================== Users =====================
  interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string | null;
    provider: string | null;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
    deletedAt: Date | null;
  }

  interface NewUser {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role?: string;
    provider?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?: Date | null;
    deletedAt?: Date | null;
  }

  // ===================== Collections =====================
  interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }

  interface NewCollection {
    id?: string;
    name: string;
    slug: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  // ===================== Products =====================
  interface Color {
    name: string;
    hex: string;
  }
  interface Product {
    id: string;
    title: string;
    slug: string;
    description: string;
    basePrice: number;
    salePrice: number;
    // rating?: number | null;
    // reviews?: number | null;
    isFeatured: boolean | null;
    isBestSeller: boolean | null;
    isNew: boolean | null;
    isOnSale: boolean | null;
    isActive: boolean | null;
    sizes: string[];
    colors: Color[];
    metaTitle: string | null;
    metaDescription: string | null;
    collectionId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }

  interface NewProduct {
    id: string;
    title: string;
    slug: string;
    description: string;
    basePrice: number;
    salePrice: number;
    // rating?: number;
    // reviews?: number;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNew?: boolean;
    isOnSale?: boolean;
    isActive?: boolean;
    sizes: string[];
    colors: string[];
    metaTitle?: string;
    metaDescription?: string;
    collectionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  // ===================== Product Images =====================
  interface ProductImage {
    id: string;
    productId: string;
    url: string;
    color: string;
    alt: string | null;
    position: number | null;
  }

  interface NewProductImage {
    id?: string;
    productId: string;
    url: string;
    color: string;
    alt?: string;
    position?: number;
  }

  // ===================== Carts =====================
  interface Cart {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean | null;
  }

  interface NewCart {
    id?: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
  }

  // ===================== Cart Items =====================
  interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    priceAtAddition: number;
    productTitle: string | null;
    productSalePrice: number | null;
    selectedSize: string | null;
    selectedColor: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface NewCartItem {
    id?: string;
    cartId: string;
    productId: string;
    quantity?: number;
    priceAtAddition: number;
    productTitle?: string;
    productSalePrice?: number;
    selectedSize?: string;
    selectedColor?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface ShippingAddress {
    firstName: string;
    lastName?: string;
    phone: string;
    email?: string;
    city: string;
    zip: string;
    province?: string;
    country_code: string;
  }

  // ===================== Props =====================
  interface MensTShirtShopProps {
    products: (Product & {
      images: ProductImage[];
      collection: Collection | null;
    })[];
  }
  interface CartItemWithProduct extends CartItem {
    imageUrl: string;
    basePrice: number;
  }
}
