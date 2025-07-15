// app/booking/confirmation/page.tsx
"use client";

import { useTourStore } from "@/store/tours/useTourBooking";
import CancelBooking from "@/tours/nextjs/components/cancel";

export default function CancelBookingPage() {
  const booking = useTourStore((state) => state.booking);

  return <CancelBooking />;
}
