ALTER TABLE "campaigns" RENAME COLUMN "userId" TO "creator_id";--> statement-breakpoint
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;