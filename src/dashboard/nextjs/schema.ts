import { z } from "zod";

export const createTourSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  price: z.string(),
  duration: z.string(),
  capacity: z.string(),
  location: z.string(),
  description: z.string(),
  itinerary: z.array(z.string()),
  included: z.array(z.string()),
  images: z.array(z.string()),

  availability: z.array(
    z.object({
      date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
      timeSlots: z
        .array(
          z.object({
            start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:mm
            end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:mm
            isAvailable: z.boolean(),
          })
        )
        .min(1, "At least one time slot required"),
    })
  ),
});

export type CreateTourSchema = z.infer<typeof createTourSchema>;
