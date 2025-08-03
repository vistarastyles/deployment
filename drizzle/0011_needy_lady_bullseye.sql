CREATE TABLE "newsletter_subscribers" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"subscribed_at" timestamp DEFAULT now()
);
