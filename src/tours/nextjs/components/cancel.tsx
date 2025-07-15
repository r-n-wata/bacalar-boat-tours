"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cancelBooking } from "../actions";

export default function CancelBooking() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const router = useRouter();

  const [cancelled, setCancelled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    const result = await cancelBooking(bookingId);
    setLoading(false);
    if (result?.success) {
      setCancelled(true);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-teal-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Cancel Booking</h1>
          <p className="text-sm mt-1">We’re sorry to see you go.</p>
        </div>

        <div className="p-6">
          {cancelled ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-teal-700">
                Your booking has been cancelled.
              </h2>
              <p className="text-gray-600 mt-2">
                We hope to see you again soon 🌊
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Are you sure you want to cancel?
              </h2>
              <p className="text-gray-700 mb-6">
                Cancelling this booking will free up your reserved spot.
              </p>
              <div className="text-center">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
                >
                  {loading ? "Cancelling..." : "Yes, Cancel Booking"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
