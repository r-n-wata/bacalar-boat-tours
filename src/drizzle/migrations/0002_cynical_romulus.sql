CREATE TABLE "operator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"logoUrl" text,
	"logoPath" text,
	"logoFilename" text,
	"logoMimeType" text,
	"logoSize" integer,
	"logoUploadedAt" timestamp with time zone,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"description" text,
	"address" text,
	"website" text,
	"social_media_links" jsonb,
	"services_offered" jsonb DEFAULT '[]'::jsonb,
	"stripeAccountId" text,
	"taxId" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."oauth_provides";--> statement-breakpoint
CREATE TYPE "public"."oauth_provides" AS ENUM('google');--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ALTER COLUMN "provider" SET DATA TYPE "public"."oauth_provides" USING "provider"::"public"."oauth_provides";--> statement-breakpoint
ALTER TABLE "operator_profiles" ADD CONSTRAINT "operator_profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;