"use client";

import { useState } from "react";
import { useTourStore } from "@/store/tours/useTourBooking";

export default function TourBookingForm({
  onSubmit,
  error,
  user,
}: {
  onSubmit: (formData: {
    name: string;
    email: string;
    confirmEmail: string;
    phone?: string;
    date: string;
    numPeople: number;
    specialRequests?: string;
  }) => void;
  error?: string;
  user: any;
}) {
  const selectedDate = useTourStore((state) => state.selectedDate);
  const selectedTime = useTourStore((state) => state.selectedTime);

  console.log("user", user);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    confirmEmail: user?.email || "",
    phone: "",
    date: "",
    numPeople: 1,
    specialRequests: "",
    timeSlotId: selectedTime?.id,
  });

  console.log("timeSlotId", selectedTime);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const MIN_PEOPLE = 1;
  const MAX_PEOPLE = 10; // change this to your desired maximum

  const adjustPeople = (amount: number) => {
    setFormData((prev) => {
      const newCount = prev.numPeople + amount;
      return {
        ...prev,
        numPeople: Math.min(Math.max(MIN_PEOPLE, newCount), MAX_PEOPLE),
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Jane Doe"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600"
        />
      </div>

      {/* Confirm Email */}
      <div>
        <label
          htmlFor="confirmEmail"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Email
        </label>
        <input
          type="email"
          id="confirmEmail"
          name="confirmEmail"
          required
          placeholder="jane@example.com"
          value={formData.confirmEmail}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Optional"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>{" "}
        {/* Number of People (Stepper Style) */}
        <div className="text-gray-500">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of People
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => adjustPeople(-1)}
              className="cursor-pointer w-10 h-10 text-lg font-bold border border-gray-800 hover:bg-gray-300 rounded-full"
            >
              −
            </button>
            <span className="text-lg font-semibold w-10 text-center">
              {formData.numPeople}
            </span>
            <button
              type="button"
              onClick={() => adjustPeople(1)}
              className="cursor-pointer w-10 h-10 text-lg font-bold border border-gray-800 hover:bg-gray-300 rounded-full"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selected Date
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={selectedDate?.toLocaleDateString() || ""}
            disabled
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selected Time
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={selectedTime.start || ""}
            disabled
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label
          htmlFor="specialRequests"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Special Requests
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          placeholder="Let us know if you have any requests..."
          value={formData.specialRequests}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition"
      >
        Book Tour
      </button>
    </form>
  );
}
