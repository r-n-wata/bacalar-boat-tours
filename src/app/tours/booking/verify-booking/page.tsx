// app/booking/confirmation/page.tsx
"use client";

import { useTourStore } from "@/store/tours/useTourBooking";
import VerifyBooking from "@/tours/nextjs/components/verify";

export default function CancelBookingPage() {
  const booking = useTourStore((state) => state.booking);

  return <VerifyBooking />;
}
