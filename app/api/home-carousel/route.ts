// /app/api/home-carousel/route.ts
import { db } from "@/db";
import { homeCarousel } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const slides = await db
      .select()
      .from(homeCarousel)
      .where(eq(homeCarousel.isActive, true))
      .orderBy(homeCarousel.sortOrder);

    return Response.json(slides);
  } catch (error) {
    console.error("Error fetching carousel data:", error);
    return new Response("Failed to fetch carousel data", { status: 500 });
  }
}
