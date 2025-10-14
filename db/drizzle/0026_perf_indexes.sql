-- Performance indexes for common query patterns
-- Note: identifiers are quoted to match exact column names defined in schema

-- Notifications: frequently filtered by campaignId, userId, read, createdAt
CREATE INDEX IF NOT EXISTS idx_notification_campaignId ON "notification"("campaignId");
CREATE INDEX IF NOT EXISTS idx_notification_userId ON "notification"("userId");
CREATE INDEX IF NOT EXISTS idx_notification_read_createdAt ON "notification"("read", "createdAt");

-- Campaigns: admin filtering by isDeleted, status, createdAt; user lookups by creator_id
CREATE INDEX IF NOT EXISTS idx_campaigns_isDeleted ON "campaigns"("isDeleted");
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_isDeleted ON "campaigns"("creator_id", "isDeleted");
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON "campaigns"("status");
CREATE INDEX IF NOT EXISTS idx_campaigns_createdAt ON "campaigns"("created_at");

-- Comments, payments, updates, views: filtered by campaignId
CREATE INDEX IF NOT EXISTS idx_comments_campaignId ON "comments"("campaignId");
CREATE INDEX IF NOT EXISTS idx_payments_campaignId ON "payments"("campaignId");
CREATE INDEX IF NOT EXISTS idx_updates_campaignId ON "updates"("campaignId");
CREATE INDEX IF NOT EXISTS idx_campaign_views_campaignId ON "campaign_views"("campaignId");

-- Users: frequent lookups by Clerk ID
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON "users"("clerk_id");
