CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"tourId" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"numPeople" integer DEFAULT 1 NOT NULL,
	"specialRequests" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tourId_tours_id_fk" FOREIGN KEY ("tourId") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;