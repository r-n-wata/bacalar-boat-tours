CREATE TABLE "tour_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tourId" uuid NOT NULL,
	"date" date NOT NULL,
	"capacity" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tour_time_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tourAvailabilityId" uuid NOT NULL,
	"time" text NOT NULL,
	"isAvailable" boolean DEFAULT true NOT NULL,
	"capacity" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tours" RENAME COLUMN "available_dates" TO "availability";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "tourTimeSlotId" uuid;--> statement-breakpoint
ALTER TABLE "tour_availability" ADD CONSTRAINT "tour_availability_tourId_tours_id_fk" FOREIGN KEY ("tourId") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_time_slots" ADD CONSTRAINT "tour_time_slots_tourAvailabilityId_tour_availability_id_fk" FOREIGN KEY ("tourAvailabilityId") REFERENCES "public"."tour_availability"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tourTimeSlotId_tour_time_slots_id_fk" FOREIGN KEY ("tourTimeSlotId") REFERENCES "public"."tour_time_slots"("id") ON DELETE cascade ON UPDATE no action;