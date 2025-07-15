import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function AvailableDatesPicker({
  serverDates = [],
  userDate,
  onChange,
  readOnly = false,
  showTitle = true,
}: {
  serverDates?: Date[];
  userDate: Date | null;
  onChange?: (date: Date | null) => void;
  readOnly?: boolean;
  showTitle?: boolean;
}) {
  const [selectedUserDate, setSelectedUserDate] = useState<Date | null>(
    userDate || null
  );

  useEffect(() => {
    setSelectedUserDate(userDate || null);
  }, [userDate?.toISOString()]);

  const handleSelect = (date?: Date) => {
    if (!date || readOnly) return;

    // If clicking the same date, deselect it; otherwise select new date
    const isSameDate =
      selectedUserDate &&
      selectedUserDate.toDateString() === date.toDateString();

    const newDate = isSameDate ? null : date;

    setSelectedUserDate(newDate);
    onChange?.(newDate);
  };

  return (
    <div>
      <DayPicker
        mode="single"
        onDayClick={handleSelect}
        selected={selectedUserDate ?? undefined}
        modifiers={{
          serverSelected: serverDates,
        }}
        modifiersClassNames={{
          serverSelected: "bg-teal-100 text-gray-500  font-bold",
          selected: "bg-teal-600 text-white rounded-full",
        }}
        disabled={[
          { before: new Date() }, // disable past
          (date) =>
            !serverDates.some((d) => d.toDateString() === date.toDateString()), // disable anything not in serverDates
        ]}
      />
    </div>
  );
}
