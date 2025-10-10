-- Add 'pending' to campaign_status enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'campaign_status') THEN
    CREATE TYPE campaign_status AS ENUM ('pending','active','rejected','completed');
  ELSE
    ALTER TYPE campaign_status ADD VALUE IF NOT EXISTS 'pending' BEFORE 'active';
  END IF;
END $$;

-- Add isBlocked to payments table
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "isBlocked" boolean NOT NULL DEFAULT false;

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS "platform_settings" (
  "id" text PRIMARY KEY NOT NULL,
  "config" jsonb NOT NULL DEFAULT '{
    "maintenanceMode": false,
    "newRegistrations": true,
    "campaignCreation": true,
    "chatEnabled": true,
    "notificationsEnabled": true,
    "kycRequired": true,
    "limits": {"maxCampaignGoal":10000000, "minCampaignGoal":50000, "campaignDurationLimit":365}
  }'
);
