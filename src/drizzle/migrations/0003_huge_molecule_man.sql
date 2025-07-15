CREATE TABLE "tours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"operatorId" uuid NOT NULL,
	"title" text NOT NULL,
	"price" integer NOT NULL,
	"duration" integer NOT NULL,
	"capacity" integer NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"itinerary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"included" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"available_dates" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_operatorId_operator_profiles_id_fk" FOREIGN KEY ("operatorId") REFERENCES "public"."operator_profiles"("id") ON DELETE cascade ON UPDATE no action;