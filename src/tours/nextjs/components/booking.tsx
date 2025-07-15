"use client";

import { getTourBySlug, createBooking } from "../actions";
import TourBookingForm from "@/components/molecules/tour/TourBookingForm";
import ProgressBar from "@/components/molecules/tour/ProgressBar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTourStore } from "@/store/tours/useTourBooking";
import { useToast } from "../../../hooks/toast/useToast";
import Toast from "@/components/molecules/toast/toast";
import { sendBookingConfirmation } from "@/tours/core/sendBookingConfirmation";

export default function BookingPage({ user }: { user: any }) {
  const selectdDate = useTourStore((state) => state.selectedDate);
  const setBooking = useTourStore((state) => state.setBooking);
  const isLoggedIn = !!user;

  const { slug } = useParams();
  const router = useRouter();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedTour = useTourStore((state) => state.selectedTour);
  const { showToast, message, type, isVisible, hideToast } = useToast();

  async function handleBookingSubmit(formData: {
    name: string;
    email: string;
    confirmEmail: string;
    phone?: string;
    date: string;
    numPeople: number;
    specialRequests?: string;
    timeSlotId: string;
  }) {
    if (formData.email !== formData.confirmEmail) {
      setError("Emails do not match.");
      return;
    }

    const booking = {
      name: isLoggedIn ? user.name : formData.name,
      email: isLoggedIn ? user.email : formData.email,
      phone: formData.phone,
      tourTitle: selectedTour.title,
      date: selectdDate?.toISOString() ?? "",
      numPeople: formData.numPeople,
      specialRequests: formData.specialRequests,
      tourId: selectedTour.id,
      userId: isLoggedIn ? user.id : undefined,
      timeSlotId: formData.timeSlotId,
    };

    console.log("booking", booking);
    console.log("formData", formData);

    const res = await createBooking(booking);

    if (res?.error) {
      showToast("Booking failed: " + res.error, "error");
    } else {
      showToast("Booking successful!", "success");
      setBooking({ ...booking, date: selectdDate?.toISOString() ?? "" });
      router.push("/tours/booking/success");
    }
  }

  if (!selectedTour) return <p className="p-4">Loading...</p>;

  return (
    <div className="bg-[#e6f4f1] min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <ProgressBar currentStep={2} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Booking Form */}
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Enter Your Details
            </h2>
            <TourBookingForm
              onSubmit={handleBookingSubmit}
              error={error}
              user={user}
            />
          </div>

          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            <img
              src={selectedTour.images?.[0] || "/placeholder.jpg"}
              alt={selectedTour.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedTour.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedTour.description}
              </p>

              <div className="pt-4 border-t border-gray-200 space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">📍</span>
                  <span>
                    <strong className="font-medium">Location:</strong>{" "}
                    {selectedTour.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-blue-500">⏱️</span>
                  <span>
                    <strong className="font-medium">Duration:</strong>{" "}
                    {selectedTour.duration} hrs
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">💰</span>
                  <span>
                    <strong className="font-medium">Price:</strong> $
                    {selectedTour.price / 100}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 pt-2">
                Prices are shown in MXN
              </p>
            </div>
          </div>
        </div>

        <Toast
          message={message}
          type={type}
          isVisible={isVisible}
          onClose={hideToast}
        />
      </div>
    </div>
  );
}
