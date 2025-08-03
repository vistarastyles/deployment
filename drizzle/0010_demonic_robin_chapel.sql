CREATE TABLE "home_carousel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_desktop" varchar(2048) NOT NULL,
	"image_tablet" varchar(2048) NOT NULL,
	"image_mobile" varchar(2048) NOT NULL,
	"title" varchar(255),
	"subtitle" text,
	"cta_text" varchar(255),
	"cta_url" varchar(2048),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
