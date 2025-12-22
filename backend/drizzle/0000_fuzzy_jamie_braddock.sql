CREATE TABLE "store" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"items" jsonb,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reference" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
