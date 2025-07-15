import { z } from "zod";

export const createTourSchema = z.object({
  title: z.string().min(1),
  price: z.string(),
  duration: z.string(),
  capacity: z.string(),
  location: z.string(),
  description: z.string(),
  itinerary: z.array(z.string()),
  included: z.array(z.string()),
  images: z.array(z.string()), // file URLs
  availability: z.array(
    z.object({
      date: z.string(), // "YYYY-MM-DD"
      timeSlots: z.array(
        z.object({
          start: z.string(), // "HH:mm"
          end: z.string(), // "HH:mm"
          isAvailable: z.boolean(),
          capacity: z.number().min(1),
        })
      ),
    })
  ),
});

export type CreateTourSchema = z.infer<typeof createTourSchema>;
