ALTER TYPE "public"."campaign_status" ADD VALUE 'pending' BEFORE 'active';--> statement-breakpoint
CREATE TABLE "platform_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"config" jsonb DEFAULT '{"maintenanceMode":false,"newRegistrations":true,"campaignCreation":true,"chatEnabled":true,"notificationsEnabled":true,"kycRequired":true,"limits":{"maxCampaignGoal":10000000,"minCampaignGoal":50000,"campaignDurationLimit":365}}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "problem" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "solution" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "impact" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "isBlocked" boolean DEFAULT false NOT NULL;