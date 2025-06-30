CREATE TABLE "userDocument" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"documentType" text NOT NULL,
	"documentNumber" text NOT NULL,
	"documentPhoto" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userDocument" ADD CONSTRAINT "userDocument_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;