ALTER TABLE "campaigns" ADD COLUMN "isDeleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "isDeleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "updates" ADD COLUMN "isDeleted" boolean DEFAULT false NOT NULL;