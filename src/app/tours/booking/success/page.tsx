// app/booking/confirmation/page.tsx
"use client";

import ProgressBar from "@/components/molecules/tour/ProgressBar";
import { useTourStore } from "@/store/tours/useTourBooking";
import Link from "next/link";

export default function BookingConfirmationPage() {
  const booking = useTourStore((state) => state.booking);
  const selectedDate = useTourStore((state) => state.selectedDate);
  const selectedTime = useTourStore((state) => state.selectedTime);
  console.log("booking", booking);

  // In a real version, you could get booking info from searchParams or context
  return (
    <div className="max-w-full mx-auto px-4 py-12 space-y-8 bg-[#e6f4f1]">
      <ProgressBar currentStep={3} />

      <div className="bg-white shadow-lg rounded-lg p-8 text-center px-40 py-20">
        <h1 className="text-3xl font-bold text-teal-700">
          🎉 Booking Confirmed!
        </h1>
        <p className="mt-4 text-gray-600">
          Thank you for booking your tour. A confirmation has been sent to your
          email.
        </p>

        {/* Optional: Booking Summary */}
        <div className="mt-8 text-left text-sm text-gray-700 space-y-2 border-t pt-6">
          <p>
            <strong>Tour:</strong> {booking.tourTitle}
          </p>
          <p>
            <strong>Date:</strong> {selectedDate?.toDateString()},{" "}
            {selectedTime.start}
          </p>
          <p>
            <strong>Guests:</strong> {booking.guests}
          </p>
          <p>
            <strong>Email:</strong> {booking.email}
          </p>
          <p>
            <strong>Booking Ref:</strong> {booking.reference}
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block bg-teal-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
