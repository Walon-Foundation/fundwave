ALTER TABLE "campaigns" ALTER COLUMN "images" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isKyc" boolean DEFAULT false NOT NULL;