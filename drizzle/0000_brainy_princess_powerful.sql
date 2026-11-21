CREATE SCHEMA "portfolio";
--> statement-breakpoint
CREATE TABLE "portfolio"."award" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"issuer" text NOT NULL,
	"date" text NOT NULL,
	"note" text,
	"order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."experience" (
	"id" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"period" text NOT NULL,
	"bullets" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."media" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"url" text NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "portfolio"."profile" (
	"id" text PRIMARY KEY DEFAULT 'main' NOT NULL,
	"name" text NOT NULL,
	"headline" text NOT NULL,
	"location" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"linkedin" text,
	"github" text,
	"summary" text NOT NULL,
	"avatar_url" text,
	"cv_url" text,
	"education" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."project" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tech_stack" text NOT NULL,
	"image_url" text,
	"link" text,
	"repo" text,
	"order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."skill_group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"items" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
