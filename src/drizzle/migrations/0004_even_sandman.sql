ALTER TABLE "tours" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_slug_unique" UNIQUE("slug");