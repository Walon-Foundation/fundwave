CREATE TYPE "public"."campaign_status" AS ENUM('pending', 'active', 'rejected', 'completed');--> statement-breakpoint
CREATE TYPE "public"."report_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'investigating', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."report_type" AS ENUM('campaign', 'user');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'banned');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"campaignId" text NOT NULL,
	"userId" text NOT NULL,
	"userName" text NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "report_type" NOT NULL,
	"targetId" text NOT NULL,
	"targetTitle" text NOT NULL,
	"reason" text NOT NULL,
	"description" text,
	"reporterId" text,
	"reporterName" text NOT NULL,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"priority" "report_priority" DEFAULT 'medium' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "withdrawals" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"campaignId" text NOT NULL,
	"amount" integer NOT NULL,
	"status" "withdrawal_status" DEFAULT 'pending' NOT NULL,
	"paymentDetails" jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" RENAME COLUMN "amountRecieved" TO "amountReceived";--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "status" "campaign_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "settings" jsonb DEFAULT '{"notifications":{"email":true,"sms":false,"push":true,"campaignUpdates":true,"donationReceipts":true,"marketingEmails":false},"privacy":{"profileVisibility":"public","showDonations":true,"showCampaigns":true},"preferences":{"language":"en","currency":"SLL","timezone":"Africa/Freetown"}}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_campaignId_campaigns_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_users_id_fk" FOREIGN KEY ("reporterId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_campaignId_campaigns_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;