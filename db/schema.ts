import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
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
