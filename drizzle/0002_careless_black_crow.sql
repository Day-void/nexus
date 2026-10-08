CREATE TYPE "public"."platform_role" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "platform_role" "platform_role" DEFAULT 'user' NOT NULL;