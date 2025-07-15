"use server";

import { z } from "zod";
import { createTourSchema } from "./schema";
import {
  ToursTable,
  OperatorProfileTable,
  TourAvailabilityTable,
  TourTimeSlotsTable,
} from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, and, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid"; // ensure this is imported

// CREATE TOUR
export async function createTour(
  userId: string,
  unsafeData: z.infer<typeof createTourSchema>
) {
  console.log("unsafe data", unsafeData);
  const parsed = createTourSchema.safeParse(unsafeData);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    return { error: "Invalid tour data" };
  }

  const data = parsed.data;

  try {
    const operatorProfile = await db.query.OperatorProfileTable.findFirst({
      where: eq(OperatorProfileTable.userId, userId),
      columns: { id: true },
    });

    if (!operatorProfile) {
      return { error: "Operator profile not found" };
    }

    const uniqueSlug = await generateUniqueSlug(data.title);

    // Insert the tour and return its ID
    const [newTour] = await db
      .insert(ToursTable)
      .values({
        operatorId: operatorProfile.id,
        title: data.title,
        slug: uniqueSlug,
        price: Number(data.price),
        duration: Number(data.duration),
        capacity: Number(data.capacity),
        location: data.location,
        description: data.description,
        itinerary: data.itinerary,
        included: data.included,
        images: data.images,
        availability: data.availability, // stored for backup/reference
      })
      .returning({ id: ToursTable.id, capacity: ToursTable.capacity });

    // ✅ Insert availability and time slots
    for (const dateEntry of data.availability) {
      const availabilityId = uuidv4();
      const dateOnly = new Date(dateEntry.date).toISOString().split("T")[0];

      await db.insert(TourAvailabilityTable).values({
        id: availabilityId,
        tourId: newTour.id,
        date: dateOnly,
        capacity: newTour.capacity, // optional, used if needed
      });

      const timeSlotRows = dateEntry.timeSlots.map((slot) => ({
        id: uuidv4(),
        tourAvailabilityId: availabilityId,
        start: slot.start,
        end: slot.end,
        isAvailable: slot.isAvailable,
        capacity: newTour.capacity,
      }));

      await db.insert(TourTimeSlotsTable).values(timeSlotRows);
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to create tour:", err);
    return { error: "Failed to create tour" };
  }
}

// GET TOURS BY USER
export async function getToursByUser(userId: string) {
  try {
    const operatorProfile = await db.query.OperatorProfileTable.findFirst({
      where: eq(OperatorProfileTable.userId, userId),
    });

    if (!operatorProfile) {
      return { error: "Operator profile not found." };
    }

    const tours = await db
      .select()
      .from(ToursTable)
      .where(eq(ToursTable.operatorId, operatorProfile.id));

    return { success: true, tours };
  } catch (error) {
    console.error("Failed to fetch tours:", error);
    return { error: "Could not fetch tours" };
  }
}

// UPDATE TOUR
export async function updateTour(
  userId: string,
  tourId: string | number,
  unsafeData: z.infer<typeof createTourSchema>
) {
  const parsed = createTourSchema.safeParse(unsafeData);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    return { error: "Invalid tour data" };
  }

  const data = parsed.data;

  try {
    const operatorProfile = await db.query.OperatorProfileTable.findFirst({
      where: eq(OperatorProfileTable.userId, userId),
      columns: { id: true },
    });

    if (!operatorProfile) {
      return { error: "Operator profile not found" };
    }

    const existingTour = await db.query.ToursTable.findFirst({
      where: eq(ToursTable.id, tourId.toString()),
      columns: { title: true },
    });

    if (!existingTour) {
      return { error: "Tour not found" };
    }

    // Regenerate slug only if title has changed
    let updatedSlug: string | undefined = undefined;
    if (existingTour.title !== data.title) {
      updatedSlug = await generateUniqueSlug(data.title);
    }

    // ✅ Update core tour data
    const result = await db
      .update(ToursTable)
      .set({
        title: data.title,
        ...(updatedSlug ? { slug: updatedSlug } : {}),
        price: Number(data.price),
        duration: Number(data.duration),
        capacity: Number(data.capacity),
        location: data.location,
        description: data.description,
        itinerary: data.itinerary,
        included: data.included,
        images: data.images,
        availability: data.availability, // for reference
      })
      .where(
        and(
          eq(ToursTable.id, tourId.toString()),
          eq(ToursTable.operatorId, operatorProfile.id)
        )
      );

    if (result.rowCount === 0) {
      return {
        error: "Tour not found or you don't have permission to update it",
      };
    }

    // ✅ Delete previous availability + timeslots
    const existingAvailabilities =
      await db.query.TourAvailabilityTable.findMany({
        where: eq(TourAvailabilityTable.tourId, tourId.toString()),
        columns: { id: true },
      });

    const availabilityIds = existingAvailabilities.map((a) => a.id);

    if (availabilityIds.length > 0) {
      await db
        .delete(TourTimeSlotsTable)
        .where(inArray(TourTimeSlotsTable.tourAvailabilityId, availabilityIds));

      await db
        .delete(TourAvailabilityTable)
        .where(eq(TourAvailabilityTable.tourId, tourId.toString()));
    }

    // ✅ Re-insert new availability and time slots
    for (const dateEntry of data.availability) {
      const availabilityId = uuidv4();
      const dateOnly = new Date(dateEntry.date).toISOString().split("T")[0];

      await db.insert(TourAvailabilityTable).values({
        id: availabilityId,
        tourId: tourId.toString(),
        date: dateOnly,
        capacity: Number(data.capacity),
      });

      const timeSlotRows = dateEntry.timeSlots.map((slot) => ({
        id: uuidv4(),
        tourAvailabilityId: availabilityId,
        start: slot.start,
        end: slot.end,
        isAvailable: slot.isAvailable,
        capacity: Number(data.capacity),
      }));

      await db.insert(TourTimeSlotsTable).values(timeSlotRows);
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to update tour:", err);
    return { error: "Failed to update tour" };
  }
}

// DELETE TOUR
export async function deleteTour(tourId: string) {
  try {
    await db.delete(ToursTable).where(eq(ToursTable.id, tourId));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tour:", error);
    return { error: "Failed to delete tour" };
  }
}

// UNIQUE SLUG GENERATOR
export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.query.ToursTable.findFirst({
      where: eq(ToursTable.slug, slug),
    });

    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
