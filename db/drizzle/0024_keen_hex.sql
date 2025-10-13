CREATE TABLE "campaign_views" (
	"id" text PRIMARY KEY NOT NULL,
	"campaignId" text NOT NULL,
	"userId" text,
	"ip" text,
	"userAgent" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaign_views" ADD CONSTRAINT "campaign_views_campaignId_campaigns_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_views" ADD CONSTRAINT "campaign_views_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;