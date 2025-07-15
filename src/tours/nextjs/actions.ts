"use server";

import { db } from "@/drizzle/db";
import {
  ToursTable,
  BookingsTable,
  UserTable,
  TourAvailabilityTable,
  TourTimeSlotsTable,
} from "@/drizzle/schema";
import { eq, sql, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendBookingConfirmation } from "../core/sendBookingConfirmation";
import { alias } from "drizzle-orm/pg-core";
import { sendCancellationEmail } from "../core/sendCancellationEmail";
import { format } from "date-fns"; // or use .toISOString().slice(0, 10)

/**
 * Fetches all tours from the database.
 *
 * @returns {Promise<{ success: boolean, tours?: Tour[], error?: string }>}
 */
export async function getAllTours() {
  try {
    const tours = await db.select().from(ToursTable);
    return { success: true, tours };
  } catch (error) {
    console.error("Failed to fetch all tours:", error);
    return { error: "Could not fetch tours" };
  }
}

/**
 * Fetches a tour by its slug.
 *
 * @param {string} slug - The slug of the tour to fetch.
 * @returns {Promise<{ success: boolean, tour?: Tour, error?: string }>}
 * If the tour is found, it returns its basic info and availability dates with
 * available time slots grouped by date. If the tour is not found, it returns an
 * error.
 */
export async function getTourBySlug(slug: string) {
  try {
    // Get the tour basic info
    const tour = await db
      .select()
      .from(ToursTable)
      .where(eq(ToursTable.slug, slug))
      .limit(1)
      .then((res) => res[0]);

    if (!tour) {
      return { error: "Tour not found" };
    }

    // Get all availability dates for the tour
    const availabilityDates = await db
      .select({
        id: TourAvailabilityTable.id,
        date: TourAvailabilityTable.date,
        capacity: TourAvailabilityTable.capacity,
      })
      .from(TourAvailabilityTable)
      .where(eq(TourAvailabilityTable.tourId, tour.id));

    // Get time slots for all those availability dates
    const timeSlots = await db
      .select({
        id: TourTimeSlotsTable.id,
        tourAvailabilityId: TourTimeSlotsTable.tourAvailabilityId,
        start: TourTimeSlotsTable.start,
        end: TourTimeSlotsTable.end,
        isAvailable: TourTimeSlotsTable.isAvailable,
        capacity: TourTimeSlotsTable.capacity,
      })
      .from(TourTimeSlotsTable)
      .where(
        eq(
          TourTimeSlotsTable.isAvailable,
          true // only fetch available slots
        )
      );

    // Group time slots by availability date
    const slotsGroupedByDate: Record<
      string,
      {
        start: string;
        end: string;
        id: string;
        capacity: number;
      }[]
    > = {};

    for (const slot of timeSlots) {
      const availability = availabilityDates.find(
        (a) => a.id === slot.tourAvailabilityId
      );
      if (!availability) continue;

      const dateKey = new Date(availability.date).toISOString().split("T")[0];

      if (!slotsGroupedByDate[dateKey]) {
        slotsGroupedByDate[dateKey] = [];
      }

      slotsGroupedByDate[dateKey].push({
        id: slot.id,
        start: slot.start,
        end: slot.end,
        capacity: slot.capacity,
      });
    }

    return {
      success: true,
      tour: {
        ...tour,
        availability: slotsGroupedByDate, // this replaces the raw tour.availability field
      },
    };
  } catch (error) {
    console.error("Failed to fetch tour by slug:", error);
    return { error: "Could not fetch tour" };
  }
}

/**
 * Creates a booking for a tour.
 *
 * @param {{
 *   name: string;
 *   email: string;
 *   phone?: string;
 *   tourId: string;
 *   tourTitle: string;
 *   date: string;
 *   timeSlotId: string;
 *   numPeople?: number;
 *   specialRequests?: string;
 *   userId?: string;
 * }} data - The booking data.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function createBooking({
  name,
  email,
  phone,
  tourId,
  tourTitle,
  date,
  timeSlotId,
  numPeople = 1,
  specialRequests,
  userId: passedUserId,
}: {
  name: string;
  email: string;
  phone?: string;
  tourId: string;
  tourTitle: string;
  date: string;
  timeSlotId: string;
  numPeople?: number;
  specialRequests?: string;
  userId?: string;
}) {
  try {
    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      return { error: "You cannot book a tour in the past." };
    }

    // 1. Guest flow: find or create user by email
    let userId = passedUserId;

    if (!userId) {
      const [existingUser] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email))
        .limit(1);

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const [newUser] = await db
          .insert(UserTable)
          .values({
            id: uuidv4(),
            name,
            email,
            password: null,
            salt: null,
            role: "user",
          })
          .returning({ id: UserTable.id });

        userId = newUser.id;
      }
    }

    console.log("timeSlotId", timeSlotId);

    // 2. Validate the selected time slot
    const [slot] = await db
      .select({
        id: TourTimeSlotsTable.id,
        tourAvailabilityId: TourTimeSlotsTable.tourAvailabilityId,
        start: TourTimeSlotsTable.start,
        end: TourTimeSlotsTable.end,
        capacity: TourTimeSlotsTable.capacity,
        isAvailable: TourTimeSlotsTable.isAvailable,
      })
      .from(TourTimeSlotsTable)
      .where(eq(TourTimeSlotsTable.id, timeSlotId))
      .limit(1);

    if (!slot || !slot.isAvailable) {
      return { error: "This time slot is not available." };
    }

    // 3. Count confirmed bookings for this slot
    const [{ booked = 0 }] = await db
      .select({
        booked: sql<number>`COALESCE(SUM(${BookingsTable.numPeople}), 0)`,
      })
      .from(BookingsTable)
      .where(
        and(
          eq(BookingsTable.tourTimeSlotId, slot.id),
          eq(BookingsTable.status, "confirmed")
        )
      );

    const remaining = slot.capacity - booked;

    if (numPeople > remaining) {
      return {
        error: `Only ${remaining} spot(s) left in this time slot.`,
      };
    }

    // 4. Insert booking
    const bookingId = uuidv4();
    const verificationToken = passedUserId ? null : uuidv4();
    const status = passedUserId ? "confirmed" : "pending_verification";

    await db.insert(BookingsTable).values({
      id: bookingId,
      userId,
      tourId,
      date: parsedDate,
      numPeople,
      specialRequests,
      tourTimeSlotId: slot.id,
      verificationToken,
      status,
    });

    // 5. Optional: update availability logic if confirmed
    if (status === "confirmed") {
      const [{ newBooked = 0 }] = await db
        .select({
          newBooked: sql<number>`COALESCE(SUM(${BookingsTable.numPeople}), 0)`,
        })
        .from(BookingsTable)
        .where(
          and(
            eq(BookingsTable.tourTimeSlotId, slot.id),
            eq(BookingsTable.status, "confirmed")
          )
        );

      const remainingCapacity = slot.capacity - newBooked;

      if (remainingCapacity <= 0) {
        await db
          .update(TourTimeSlotsTable)
          .set({ isAvailable: false })
          .where(eq(TourTimeSlotsTable.id, slot.id));
      }
    }

    // 6. Send email
    await sendBookingConfirmation({
      name,
      email,
      date,
      numPeople,
      tourTitle,
      bookingId,
      time: slot.start,
      verificationToken: passedUserId
        ? undefined
        : (verificationToken ?? undefined),
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to create booking:", error);
    return { error: "Could not create booking" };
  }
}

/**
 * Retrieves the most popular tours.
 *
 * @param {number} [limit=5] The number of popular tours to return.
 * @return {Promise<{ success: boolean, popularTours: { tourId: string, slug: string, title: string, images: string[], bookingCount: number }[] }>}
 */
export async function getMostPopularTours(limit = 5) {
  try {
    const popularTours = await db
      .select({
        tourId: ToursTable.id,
        slug: ToursTable.slug,
        title: ToursTable.title,
        images: ToursTable.images,
        bookingCount: sql<number>`COUNT(${BookingsTable.id})`,
      })
      .from(ToursTable)
      .leftJoin(BookingsTable, eq(BookingsTable.tourId, ToursTable.id))
      .groupBy(ToursTable.id)
      // Order by the same COUNT expression, not by the alias
      .orderBy(sql`COUNT(${BookingsTable.id}) DESC`)
      .limit(limit);

    return { success: true, popularTours };
  } catch (error) {
    console.error("Failed to fetch popular tours:", error);
    return {
      error: "Could not fetch popular tours",
      details: error instanceof Error ? error.message : error,
    };
  }
}

/**
 * Cancels a booking by updating its status to "cancelled" in the database.
 * If the booking was previously confirmed, it restores the capacity for the tour date.
 * Optionally sends a cancellation email to the user.
 *
 * @param {string | null} bookingId - The ID of the booking to be cancelled.
 * @returns {Promise<{ success: boolean } | { error: string }>} - A promise that resolves to an object indicating the result of the cancellation.
 */

export async function cancelBooking(bookingId: string | null) {
  if (!bookingId) return { error: "No booking ID" };

  try {
    // 1. Fetch booking details
    const [booking] = await db
      .select({
        id: BookingsTable.id,
        date: BookingsTable.date,
        numPeople: BookingsTable.numPeople,
        userId: BookingsTable.userId,
        tourId: BookingsTable.tourId,
        status: BookingsTable.status,
      })
      .from(BookingsTable)
      .where(eq(BookingsTable.id, bookingId));

    if (!booking) return { error: "Booking not found" };

    // 2. Cancel the booking
    const result = await db
      .update(BookingsTable)
      .set({ status: "cancelled" })
      .where(eq(BookingsTable.id, bookingId));

    if (result.rowCount === 0) {
      return { error: "Booking not found or already cancelled" };
    }

    // 3. If it was previously confirmed, restore capacity
    if (booking.status === "confirmed") {
      // Try to find existing availability row
      const [existing] = await db
        .select({ capacity: TourAvailabilityTable.capacity })
        .from(TourAvailabilityTable)
        .where(
          and(
            eq(TourAvailabilityTable.tourId, booking.tourId),
            eq(TourAvailabilityTable.date, booking.date.toISOString())
          )
        );

      if (existing) {
        // Update existing row
        await db
          .update(TourAvailabilityTable)
          .set({
            capacity: existing.capacity + booking.numPeople,
          })
          .where(
            and(
              eq(TourAvailabilityTable.tourId, booking.tourId),
              eq(TourAvailabilityTable.date, booking.date.toISOString())
            )
          );
      } else {
        // Recreate availability row if it was deleted (was fully booked)
        await db.insert(TourAvailabilityTable).values({
          id: uuidv4(),
          tourId: booking.tourId,
          date: booking.date.toISOString(),
          capacity: booking.numPeople,
        });
      }
    }

    // 4. Send cancellation email (optional)
    const [user] = await db
      .select({ name: UserTable.name, email: UserTable.email })
      .from(UserTable)
      .where(eq(UserTable.id, booking.userId));

    const [tour] = await db
      .select({ title: ToursTable.title })
      .from(ToursTable)
      .where(eq(ToursTable.id, booking.tourId));

    if (user && tour) {
      await sendCancellationEmail({
        name: user.name,
        email: user.email,
        tourTitle: tour.title,
        date: booking.date.toISOString(),
        numPeople: booking.numPeople,
        bookingId: booking.id,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Cancel booking error:", error);
    return { error: "Failed to cancel booking" };
  }
}

/**
 * Verifies a booking with the given token and marks it as confirmed.
 * If the booking is valid, it also sends a confirmation email to the user.
 * If the booking is invalid or expired, it returns an error.
 *
 * @param {string} token - The verification token sent to the user's email.
 * @returns {Promise<{ success: boolean } | { error: string }>} - A promise that resolves to an object indicating the result of the verification.
 */
export async function verifyBooking(token: string) {
  if (!token) return { error: "Missing token" };

  // Get booking with user and tour details
  const booking = await db
    .select({
      bookingId: BookingsTable.id,
      bookingDate: BookingsTable.date,
      numPeople: BookingsTable.numPeople,
      email: UserTable.email,
      name: UserTable.name,
      tourTitle: ToursTable.title,
      tourId: ToursTable.id,
      tourTimeSlotId: BookingsTable.tourTimeSlotId,
    })
    .from(BookingsTable)
    .innerJoin(UserTable, eq(BookingsTable.userId, UserTable.id))
    .innerJoin(ToursTable, eq(BookingsTable.tourId, ToursTable.id))
    .where(eq(BookingsTable.verificationToken, token))
    .then((res) => res[0]);

  if (!booking) {
    return { error: "Invalid or expired token" };
  }

  // Mark booking as confirmed
  await db
    .update(BookingsTable)
    .set({ status: "confirmed", verificationToken: null })
    .where(eq(BookingsTable.id, booking.bookingId));

  // Fetch time slot info
  const timeSlot = await db
    .select({
      id: TourTimeSlotsTable.id,
      capacity: TourTimeSlotsTable.capacity,
      tourAvailabilityId: TourTimeSlotsTable.tourAvailabilityId,
      start: TourTimeSlotsTable.start,
    })
    .from(TourTimeSlotsTable)
    .where(eq(TourTimeSlotsTable.id, booking.tourTimeSlotId!))
    .then((res) => res[0]);

  if (!timeSlot) {
    return { error: "Associated time slot not found" };
  }

  // Count confirmed bookings for this time slot
  const [{ booked = 0 }] = await db
    .select({
      booked: sql<number>`COALESCE(SUM(${BookingsTable.numPeople}), 0)`,
    })
    .from(BookingsTable)
    .where(
      and(
        eq(BookingsTable.tourTimeSlotId, timeSlot.id),
        eq(BookingsTable.status, "confirmed")
      )
    );

  const remaining = timeSlot.capacity - booked;

  if (remaining <= 0) {
    await db
      .update(TourTimeSlotsTable)
      .set({ isAvailable: false })
      .where(eq(TourTimeSlotsTable.id, timeSlot.id));
  }

  // Send confirmation
  await sendBookingConfirmation({
    name: booking.name,
    email: booking.email,
    tourTitle: booking.tourTitle,
    date: booking.bookingDate.toISOString(),
    numPeople: booking.numPeople,
    bookingId: booking.bookingId,
    time: timeSlot.start,
  });

  return { success: true };
}

/**
 * Fetches all available dates for a tour, with their associated time slots
 * and remaining capacities.
 *
 * @param {string} tourId - The ID of the tour to fetch available dates for.
 * @returns {Promise<{
 *   success: boolean;
 *   error?: string;
 *   dates?: Array<{
 *     date: string;
 *     timeSlots: Array<{
 *       start: string;
 *       end: string;
 *       isAvailable: boolean;
 *       remainingCapacity: number;
 *     }>;
 *   }>;
 * }>}
 */
export async function getAvailableDatesForTour(tourId: string) {
  try {
    // Get all availability rows for the tour
    const availabilityRows = await db
      .select({
        id: TourAvailabilityTable.id,
        date: TourAvailabilityTable.date,
        capacity: TourAvailabilityTable.capacity,
      })
      .from(TourAvailabilityTable)
      .where(eq(TourAvailabilityTable.tourId, tourId));

    if (!availabilityRows.length) {
      return { success: true, dates: [] };
    }

    // Get total confirmed bookings per time slot
    const bookings = await db
      .select({
        timeSlotId: BookingsTable.tourTimeSlotId,
        booked: sql<number>`SUM(${BookingsTable.numPeople})`,
      })
      .from(BookingsTable)
      .where(
        and(
          eq(BookingsTable.tourId, tourId),
          eq(BookingsTable.status, "confirmed")
        )
      )
      .groupBy(BookingsTable.tourTimeSlotId);

    const bookingsMap = new Map<string, number>();
    bookings.forEach((b) => {
      if (b.timeSlotId) {
        bookingsMap.set(b.timeSlotId, b.booked);
      }
    });

    // For each date, get its time slots
    const enrichedDates = await Promise.all(
      availabilityRows.map(async (a) => {
        const slots = await db
          .select({
            id: TourTimeSlotsTable.id,
            start: TourTimeSlotsTable.start,
            end: TourTimeSlotsTable.end,
            isAvailable: TourTimeSlotsTable.isAvailable,
            capacity: TourTimeSlotsTable.capacity,
          })
          .from(TourTimeSlotsTable)
          .where(eq(TourTimeSlotsTable.tourAvailabilityId, a.id));

        const enrichedSlots = slots.map((s) => {
          const booked = bookingsMap.get(s.id) || 0;
          return {
            start: s.start,
            end: s.end,
            isAvailable: s.isAvailable && s.capacity > booked,
            remainingCapacity: s.capacity - booked,
            timeSlotId: s.id,
          };
        });

        return {
          date: new Date(a.date).toISOString(),
          timeSlots: enrichedSlots.filter((s) => s.isAvailable),
        };
      })
    );

    // Filter out days where no time slots are available
    const filteredDates = enrichedDates.filter((d) => d.timeSlots.length > 0);

    return { success: true, dates: filteredDates };
  } catch (error) {
    console.error("Error fetching available dates:", error);
    return { error: "Could not fetch availability" };
  }
}

/**
 * Retrieves available time slots for a specific tour date.
 *
 * This function fetches all time slots for a given tour and date, computes
 * the remaining capacity for each slot by deducting confirmed bookings, and
 * returns the slots that are still available.
 *
 * @param {string} tourId - The ID of the tour to retrieve time slots for.
 * @param {string} date - The date for which to fetch available time slots, in ISO format.
 * @returns {Promise<{ success: boolean, timeSlots: { id: string, start: string, end: string, capacity: number, isAvailable: boolean, remainingCapacity: number }[] } | { error: string }>}
 * A promise resolving to an object containing the success status and an array of available time slots,
 * each with its remaining capacity. If an error occurs, the promise resolves to an object with an error message.
 */

export async function getAvailableTimeSlotsForDate(
  tourId: string,
  date: string
) {
  try {
    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0);
    const formattedDate = format(date, "yyyy-MM-dd");

    // Step 1: Get the matching availability row
    const [availability] = await db
      .select({ id: TourAvailabilityTable.id })
      .from(TourAvailabilityTable)
      .where(
        and(
          eq(TourAvailabilityTable.tourId, tourId),
          eq(TourAvailabilityTable.date, formattedDate)
        )
      );

    if (!availability) {
      return { success: true, timeSlots: [] }; // No availability set for this date
    }

    const availabilityId = availability.id;

    // Step 2: Get all time slots for that date
    const timeSlots = await db
      .select({
        id: TourTimeSlotsTable.id,
        start: TourTimeSlotsTable.start,
        end: TourTimeSlotsTable.end,
        capacity: TourTimeSlotsTable.capacity,
        isAvailable: TourTimeSlotsTable.isAvailable,
      })
      .from(TourTimeSlotsTable)
      .where(eq(TourTimeSlotsTable.tourAvailabilityId, availabilityId));

    if (!timeSlots.length) {
      return { success: true, timeSlots: [] }; // No slots defined
    }

    // Step 3: Fetch current bookings per time slot
    const bookings = await db
      .select({
        tourTimeSlotId: BookingsTable.tourTimeSlotId,
        booked: sql<number>`SUM(${BookingsTable.numPeople})`,
      })
      .from(BookingsTable)
      .where(
        and(
          eq(BookingsTable.date, parsedDate),
          eq(BookingsTable.status, "confirmed")
        )
      )
      .groupBy(BookingsTable.tourTimeSlotId);

    const bookingsMap = new Map<string, number>();
    bookings.forEach((b) => {
      if (b.tourTimeSlotId) {
        bookingsMap.set(b.tourTimeSlotId, b.booked);
      }
    });

    // Step 4: Compute remaining capacity per slot
    const availableSlots = timeSlots
      .filter((slot) => slot.isAvailable)
      .map((slot) => {
        const booked = bookingsMap.get(slot.id) || 0;
        return {
          ...slot,
          remainingCapacity: slot.capacity - booked,
        };
      })
      .filter((slot) => slot.remainingCapacity > 0);

    return { success: true, timeSlots: availableSlots };
  } catch (error) {
    console.error("❌ Failed to get available time slots:", error);
    return { error: "Could not fetch available time slots" };
  }
}
