CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"razorpay_order_id" varchar(255),
	"payment_id" varchar(255),
	"payment_method" varchar(50) NOT NULL,
	"payment_status" varchar(50) NOT NULL,
	"amount" numeric NOT NULL,
	"shipping_address" jsonb,
	"items" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "reviews";