"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { isSameDay, parseISO } from "date-fns";

interface CalendarSelectorProps {
  availableDates: string[]; // ISO strings like "2025-06-24"
  onSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

export default function CalendarSelector({
  availableDates,
  onSelect,
  selectedDate,
}: CalendarSelectorProps) {
  const parsedAvailableDates = availableDates.map((date) => parseISO(date));

  const isAvailable = (date: Date) =>
    parsedAvailableDates.some((available) => isSameDay(date, available));

  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onSelect}
      modifiers={{ available: isAvailable }}
      modifiersClassNames={{
        available: "bg-teal-100 text-teal-800 font-semibold",
      }}
      disabled={(date) => !isAvailable(date)}
    />
  );
}
