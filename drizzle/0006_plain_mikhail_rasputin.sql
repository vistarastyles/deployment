ALTER TABLE "cart_items" ADD COLUMN "product_title" varchar(255);--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "product_sale_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "selected_size" varchar(50);--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "selected_color" varchar(50);