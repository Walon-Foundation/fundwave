ALTER TABLE "campaigns" ALTER COLUMN "funding_goal" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "amount_received" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "amountContribute" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "withdrawals" ALTER COLUMN "amount" SET DATA TYPE double precision;