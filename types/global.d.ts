import { users } from "@/db/schema";
import type { InferModel } from "drizzle-orm";

declare global {
  type User = InferModel<typeof users >;
  type NewUser = InferModel<typeof users, "insert">;
}

export {};
