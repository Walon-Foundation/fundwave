CREATE TYPE "public"."campaign_type" AS ENUM('business', 'project', 'personal', 'community');--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "funding_goal" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "amount_received" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "campaign_end_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "creator_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "image" text NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "short_description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "problem" text NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "solution" text NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "impact" text NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "campaign_type" "campaign_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "fundingGoal";--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "amountReceived";--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "campaignEndDate";--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "creatorName";--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "images";--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "short description";--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "fullStory";--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "updatedAt";