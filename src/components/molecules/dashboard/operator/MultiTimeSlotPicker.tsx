"use client";

import { useState } from "react";

export default function MultiTimeSlotPicker({
  value = [],
  onChange,
}: {
  value?: { start: string; end: string; isAvailable: boolean }[];
  onChange?: (
    slots: { start: string; end: string; isAvailable: boolean }[]
  ) => void;
}) {
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1); // default 1 hour duration

  function calculateEndTime(start: string, durationHours: number): string {
    const [startHour, startMinute] = start.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(startHour);
    startDate.setMinutes(startMinute);

    const endDate = new Date(
      startDate.getTime() + durationHours * 60 * 60 * 1000
    );
    const endHours = String(endDate.getHours()).padStart(2, "0");
    const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

    return `${endHours}:${endMinutes}`;
  }

  function addTimeSlot() {
    if (!startTime || duration <= 0) return;

    const end = calculateEndTime(startTime, duration);
    const newSlot = { start: startTime, end, isAvailable: true };
    onChange?.([...value, newSlot]);
    setStartTime("");
  }

  function toggleAvailability(index: number) {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      isAvailable: !updated[index].isAvailable,
    };
    onChange?.(updated);
  }

  function removeSlot(index: number) {
    const updated = value.filter((_, i) => i !== index);
    onChange?.(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (hours)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-20"
            min={1}
          />
        </div>

        <button
          type="button"
          onClick={addTimeSlot}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Add Time Slot
        </button>
      </div>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((slot, index) => (
            <li
              key={index}
              className={`flex justify-between items-center border p-2 rounded text-sm ${
                slot.isAvailable ? "bg-white" : "bg-red-50 text-red-500"
              }`}
            >
              <span>
                {slot.start} – {slot.end}{" "}
                {!slot.isAvailable && <span>(Blocked)</span>}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleAvailability(index)}
                  className="text-blue-500 hover:underline"
                >
                  {slot.isAvailable ? "Block" : "Unblock"}
                </button>
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
