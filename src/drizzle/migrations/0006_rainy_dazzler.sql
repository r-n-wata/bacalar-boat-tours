ALTER TABLE "bookings" ADD COLUMN "verificationToken" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_verificationToken_unique" UNIQUE("verificationToken");