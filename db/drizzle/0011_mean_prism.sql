CREATE TYPE "public"."type" AS ENUM('comment', 'update', 'donations', 'campaignStuff');--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"campaignId" text NOT NULL,
	"type" "type" NOT NULL,
	"userId" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "emailVerification" CASCADE;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_campaignId_campaigns_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;