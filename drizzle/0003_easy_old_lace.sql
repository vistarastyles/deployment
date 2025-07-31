CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "collections_name_unique" UNIQUE("name"),
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" varchar(1024) NOT NULL,
	"color" varchar(50) NOT NULL,
	"alt" varchar(255),
	"position" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"base_price" numeric(10, 2) NOT NULL,
	"sale_price" numeric(10, 2),
	"rating" numeric(2, 1) DEFAULT '0.0',
	"reviews" numeric(10, 0) DEFAULT '0',
	"is_featured" boolean DEFAULT false,
	"is_best_seller" boolean DEFAULT false,
	"is_new" boolean DEFAULT false,
	"is_on_sale" boolean DEFAULT false,
	"stock" integer DEFAULT 0,
	"sizes" jsonb NOT NULL,
	"colors" jsonb NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"collection_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collections_name_idx" ON "collections" USING btree ("name");--> statement-breakpoint
CREATE INDEX "collections_slug_idx" ON "collections" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_images_color_idx" ON "product_images" USING btree ("color");--> statement-breakpoint
CREATE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_collection_id_idx" ON "products" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "products_is_featured_idx" ON "products" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "products_is_new_idx" ON "products" USING btree ("is_new");--> statement-breakpoint
CREATE INDEX "products_is_best_seller_idx" ON "products" USING btree ("is_best_seller");--> statement-breakpoint
CREATE INDEX "products_is_on_sale_idx" ON "products" USING btree ("is_on_sale");