-- Make problem/solution/impact nullable on campaigns
ALTER TABLE "campaigns" ALTER COLUMN "problem" DROP NOT NULL;
ALTER TABLE "campaigns" ALTER COLUMN "solution" DROP NOT NULL;
ALTER TABLE "campaigns" ALTER COLUMN "impact" DROP NOT NULL;
