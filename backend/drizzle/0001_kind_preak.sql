CREATE TABLE "admin" (
	"name" varchar(255) NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "admin_email_unique" UNIQUE("email"),
	CONSTRAINT "admin_password_unique" UNIQUE("password")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" real NOT NULL,
	"image" jsonb NOT NULL,
	"category" varchar(255) NOT NULL,
	"subCategory" varchar(255) NOT NULL,
	"sizes" jsonb NOT NULL,
	"bestseller" boolean DEFAULT false,
	"date" integer NOT NULL
);
