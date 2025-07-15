// AvailableDatesWithTimesPicker.tsx
"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import MultiTimeSlotPicker from "./MultiTimeSlotPicker";

export type TimeSlots = {
  start: string;
  end: string;
  isAvailable: boolean;
};

export type DateWithTimes = {
  date: string; // YYYY-MM-DD
  timeSlots: TimeSlots[];
};

function parseLocalDateFromYYYYMMDD(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}

export default function AvailableDatesWithTimesPicker({
  value = [],
  onChange,
  duration = 0,
  showTitle = true,
}: {
  value?: DateWithTimes[];
  onChange?: (datesWithTimes: DateWithTimes[]) => void;
  duration: number;
  showTitle?: boolean;
}) {
  const [availability, setAvailability] = useState<Record<string, TimeSlots[]>>(
    () => {
      const map: Record<string, TimeSlots[]> = {};
      value.forEach(({ date, timeSlots }) => {
        map[date] = Array.isArray(timeSlots) ? timeSlots : [];
      });
      return map;
    }
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 89);

  useEffect(() => {
    const defaultSlots: TimeSlots[] = [
      { start: "09:00", end: "10:00", isAvailable: true },
      { start: "13:00", end: "14:00", isAvailable: true },
      { start: "16:00", end: "17:00", isAvailable: true },
    ];

    // Only apply default slots if `value` is empty
    const isValueEmpty = !value || value.length === 0;

    if (isValueEmpty) {
      const filled: Record<string, TimeSlots[]> = {};

      Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const iso = date.toISOString().split("T")[0];
        filled[iso] = defaultSlots.map((s) => ({ ...s }));
      });

      setAvailability(filled);

      onChange?.(
        Object.entries(filled).map(([date, timeSlots]) => ({ date, timeSlots }))
      );
    }
  }, [value]);

  const handleSlotChange = (date: string, updatedSlots: TimeSlots[]) => {
    const updated = { ...availability, [date]: updatedSlots };
    setAvailability(updated);
    const cleaned = Object.entries(updated)
      .filter(([, slots]) => slots.length > 0)
      .map(([d, timeSlots]) => ({
        date: d,
        timeSlots,
      }));
    onChange?.(cleaned);
  };

  return (
    <div className="space-y-4">
      {showTitle && (
        <label className="block mb-1 font-medium text-black">
          Available Dates & Time Slots
        </label>
      )}

      <DayPicker
        mode="single"
        selected={selectedDate ? new Date(selectedDate) : undefined}
        onDayClick={(date) => {
          const iso = date?.toISOString().split("T")[0];
          if (!iso || !availability[iso]) return;
          setSelectedDate(iso);
        }}
        fromDate={today}
        toDate={maxDate}
        className="border rounded p-4"
        modifiers={{
          available: Object.entries(availability)
            .filter(
              ([, slots]) =>
                Array.isArray(slots) && slots.some((s) => s.isAvailable)
            )
            .map(([d]) => parseLocalDateFromYYYYMMDD(d)),

          blocked: Object.entries(availability)
            .filter(
              ([, slots]) =>
                Array.isArray(slots) &&
                slots.length > 0 &&
                slots.every((s) => !s.isAvailable)
            )
            .map(([d]) => parseLocalDateFromYYYYMMDD(d)),
        }}
        modifiersClassNames={{
          available: "bg-green-100 text-green-800",
          blocked: "bg-red-100 text-red-700 line-through",
        }}
      />

      {selectedDate && (
        <div className="border p-4 rounded bg-gray-50 space-y-2 mt-4">
          <p className="font-semibold mb-2">Time slots for {selectedDate}</p>
          <MultiTimeSlotPicker
            duration={duration}
            value={availability[selectedDate] || []}
            onChange={(slots) => handleSlotChange(selectedDate, slots)}
          />
          <button
            onClick={() => setSelectedDate(null)}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Close Time Slot Editor
          </button>
        </div>
      )}
    </div>
  );
}
