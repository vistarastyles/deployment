import {
  pgTable,
  uuid,
  varchar,
  numeric,
  text,
  jsonb,
  boolean,
  timestamp,
  integer,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ========== Users ==========
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 }).primaryKey(), // Clerk ID
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }).unique(),
    role: varchar("role", { length: 20 }).default("user"),
    provider: varchar("provider", { length: 50 }),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
    lastLoginAt: timestamp("last_login_at"),
    deletedAt: timestamp("deleted_at"),
  },
  (users) => ({
    emailIndex: index("users_email_idx").on(users.email),
    phoneIndex: index("users_phone_idx").on(users.phone),
    lastLoginIndex: index("users_last_login_idx").on(users.lastLoginAt),
  })
);

// ========== Collections ==========
export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").default(sql`now()`),
    updatedAt: timestamp("updated_at").default(sql`now()`),
  },
  (collections) => ({
    nameIdx: index("collections_name_idx").on(collections.name),
    slugIdx: index("collections_slug_idx").on(collections.slug),
  })
);

// ========== Products ==========
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description").notNull(),

    basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
    salePrice: numeric("sale_price", { precision: 10, scale: 2 }),

    // rating: numeric("rating", { precision: 2, scale: 1 }).default("0.0"),
    // reviews: numeric("reviews", { precision: 10, scale: 0 }).default("0"),

    isFeatured: boolean("is_featured").default(false),
    isBestSeller: boolean("is_best_seller").default(false),
    isNew: boolean("is_new").default(false),
    isOnSale: boolean("is_on_sale").default(false),
    isActive: boolean("is_active").default(true),

    sizes: jsonb("sizes").notNull(),
    colors: jsonb("colors").notNull(),

    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),

    collectionId: uuid("collection_id").references(() => collections.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at").default(sql`now()`),
    updatedAt: timestamp("updated_at").default(sql`now()`),
  },
  (products) => ({
    slugIdx: index("products_slug_idx").on(products.slug),
    collectionIdx: index("products_collection_id_idx").on(
      products.collectionId
    ),
    isFeaturedIdx: index("products_is_featured_idx").on(products.isFeatured),
    isNewIdx: index("products_is_new_idx").on(products.isNew),
    isBestSellerIdx: index("products_is_best_seller_idx").on(
      products.isBestSeller
    ),
    isOnSaleIdx: index("products_is_on_sale_idx").on(products.isOnSale),
  })
);

// ========== Product Images ==========
export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    url: varchar("url", { length: 1024 }).notNull(),
    color: varchar("color", { length: 50 }).notNull(),
    alt: varchar("alt", { length: 255 }),
    position: integer("position").default(0), // to control image order
  },
  (productImages) => ({
    productIdIdx: index("product_images_product_id_idx").on(
      productImages.productId
    ),
    colorIdx: index("product_images_color_idx").on(productImages.color),
  })
);

// ========== Carts ==========
export const carts = pgTable(
  "carts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
    isActive: boolean("is_active").default(true),
  },
  (carts) => ({
    userIdx: index("carts_user_id_idx").on(carts.userId),
  })
);

// ========== Cart Items ==========
export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull().default(1),
    priceAtAddition: numeric("price_at_addition", {
      precision: 10,
      scale: 2,
    }).notNull(),
    // New fields for product details and user selection
    productTitle: varchar("product_title", { length: 255 }),
    productSalePrice: numeric("product_sale_price", {
      precision: 10,
      scale: 2,
    }),
    selectedSize: varchar("selected_size", { length: 50 }),
    selectedColor: varchar("selected_color", { length: 50 }),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (cartItems) => ({
    cartIdx: index("cart_items_cart_id_idx").on(cartItems.cartId),
    productIdx: index("cart_items_product_id_idx").on(cartItems.productId),
    uniqueCartProduct: unique().on(
      cartItems.cartId,
      cartItems.productId,
      cartItems.selectedSize,
      cartItems.selectedColor
    ),
  })
);
