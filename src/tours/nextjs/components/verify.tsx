"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyBooking } from "../actions";
import ProgressBar from "@/components/molecules/tour/ProgressBar";
import Link from "next/link";

export default function VerifyBooking() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    async function verify() {
      const result = await verifyBooking(token!);
      if (result.error) setStatus("error");
      else setStatus("success");
    }

    if (token) verify();
    else setStatus("error");
  }, [token]);

  return (
    <div className="max-w-full mx-auto px-4 py-12 space-y-8 bg-[#e6f4f1] min-h-screen">
      <ProgressBar currentStep={3} />

      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-2xl mx-auto">
        {status === "verifying" && (
          <>
            <h1 className="text-2xl font-semibold text-teal-700 mb-4">
              Verifying your booking...
            </h1>
            <p className="text-gray-600">
              Hang tight, we're checking your confirmation token.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-3xl font-bold text-teal-700">
              🎉 Booking Confirmed!
            </h1>
            <p className="mt-4 text-gray-600">
              Thank you! Your booking is now confirmed. A confirmation email has
              been sent to you.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-block bg-teal-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-800 transition"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-semibold text-red-600 mb-4">
              Invalid or Expired Token ❌
            </h1>
            <p className="text-gray-600">
              The link you used is either invalid or has expired. Please try
              booking again or contact support.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-block bg-gray-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
