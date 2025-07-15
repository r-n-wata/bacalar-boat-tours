"use client";

import { useEffect, useState } from "react";
import AvailableDatesPicker from "../tour/AvailableDatePicker";
import Link from "next/link";
import { useTourStore } from "@/store/tours/useTourBooking";

function toLocalDateOnly(dateInput: string | Date): Date {
  if (dateInput instanceof Date) {
    return new Date(
      dateInput.getFullYear(),
      dateInput.getMonth(),
      dateInput.getDate()
    );
  }

  if (typeof dateInput === "string") {
    // Expecting ISO string like "2025-07-15T00:00:00.000Z" or "2025-07-15"
    const [year, month, day] = dateInput.split("T")[0].split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  }

  throw new Error("Invalid date input");
}

interface BookingSidebarProps {
  price: number;
  availableDates: any;
  duration: number;
  capacity: number;
  tour: any;
}

export default function BookingSidebar({
  price,
  availableDates,
  duration,
  capacity,
  tour,
}: BookingSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Record<string, any>>(
    {}
  ); // You can store start time or an object
  const setUserSelectedDate = useTourStore((state) => state.setSelectedDate);
  const setUserSelectedTime = useTourStore((state) => state.setSelectedTime);

  // Get all slots for the selected date
  const slotsForDate =
    availableDates.find(
      (d: any) =>
        new Date(d.date).toDateString() === selectedDate?.toDateString()
    )?.timeSlots || [];

  useEffect(() => {
    setUserSelectedDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setUserSelectedTime(selectedTimeSlot);
  }, [selectedTimeSlot]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 px-10 space-y-5 w-full max-w-[400px]">
      {/* Price */}
      <div>
        <p className="text-3xl font-bold text-gray-800">${price}</p>
      </div>

      {/* Duration */}
      <div>
        <p className="text-sm text-gray-500">Duration</p>
        <p className="text-lg font-medium text-gray-800">{duration} hours</p>
      </div>

      {/* Capacity */}
      <div>
        <p className="text-sm text-gray-500">Capacity</p>
        <p className="text-lg font-medium text-gray-800">
          Up to {capacity} people
        </p>
      </div>

      {/* Location */}
      {/* Uncomment below if location is needed
      <div>
        <p className="text-sm text-gray-500">Location</p>
        <p className="text-lg font-medium text-gray-800">{location}</p>
      </div>
      */}

      {/* Dates */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Select Date</p>
        <AvailableDatesPicker
          serverDates={availableDates.map((d: any) => toLocalDateOnly(d.date))}
          userDate={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />

        {selectedDate && slotsForDate.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-1 pt-6">Available Times</p>
            <div className="flex flex-wrap gap-2">
              {slotsForDate
                .filter((slot: any) => slot.isAvailable)
                .map((slot: any) => {
                  const label = `${slot.start} - ${slot.end}`;
                  const isSelected = selectedTimeSlot.start === slot.start;
                  console.log("slot", slot);
                  return (
                    <button
                      key={slot.start}
                      onClick={() =>
                        setSelectedTimeSlot({
                          start: slot.start,
                          id: slot.timeSlotId,
                        })
                      }
                      className={`px-3 py-1 rounded-md border ${
                        isSelected
                          ? "bg-teal-600 text-white border-teal-700"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Book Button */}
      {tour?.slug && (
        <div className="w-full bg-teal-700 text-white text-sm font-semibold py-2 rounded-md hover:bg-teal-800 transition text-center">
          <Link href={`/tours/booking/${tour.slug}`}>Select Date</Link>
        </div>
      )}
    </div>
  );
}
