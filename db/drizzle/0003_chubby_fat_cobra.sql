ALTER TABLE "emailVerification" DROP CONSTRAINT "emailVerification_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "logs" ALTER COLUMN "metaData" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "emailVerification" ADD COLUMN "userEmail" text NOT NULL;--> statement-breakpoint
ALTER TABLE "emailVerification" ADD CONSTRAINT "emailVerification_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emailVerification" DROP COLUMN "userId";