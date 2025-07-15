"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TourHero from "@/components/molecules/tour/TourHero";
import TourInfo from "@/components/molecules/tour/TourInfo";
import ImageGallery from "@/components/molecules/tour/ImageGallery";
import IncludedSection from "@/components/molecules/tour/IncludedSection";
import BookingSidebar from "@/components/molecules/tour/BookingSidebar";
import Itinerary from "@/components/molecules/tour/Itineray";
import { getTourBySlug, getAvailableDatesForTour } from "../actions";
import ImageGalleryGrid from "@/components/molecules/tour/ImageGalleryGrid";
import BackButton from "@/components/atoms/Buttons/BackButton";
import { useTourStore } from "@/store/tours/useTourBooking";

interface Tour {
  id: string;
  title: string;
  price: number;
  duration: number;
  description: string;
  images: string[];
  included: string[];
  availableDates: string[];
  capacity: number;
  location: string;
  itinerary: string[];
}
const placeholderImages = [
  "/tours-placeholder-images/sailing.jpg",
  "/tours-placeholder-images/sailing2.jpg",
  "/tours-placeholder-images/sailing3.jpg",
  "/tours-placeholder-images/sailing4.jpg",
  "/tours-placeholder-images/sailing5.jpg",
];

export default function TourPage() {
  const setSelectedTour = useTourStore((state) => state.setSelectedTour);
  const selectedTour = useTourStore((state) => state.selectedTour);

  const params = useParams();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : "";

  const [tour, setTour] = useState<Tour>();
  const [availableDates, setAvailableDates] = useState<any>([]);

  useEffect(() => {
    async function fetchTour() {
      const response = await getTourBySlug(slug);
      if (response.success) {
        setTour(response.tour as any);
        setSelectedTour(response.tour as any);
      }
    }
    fetchTour();
  }, [slug]);

  useEffect(() => {
    async function fetchAvailableDates() {
      if (!tour?.id) return;
      const response = await getAvailableDatesForTour(tour.id);
      if (response.success) {
        console.log("response", response);
        const formatted = response.dates.map((d: any) => ({
          date: new Date(d.date),
          timeSlots: d.timeSlots, // e.g. [{ start: "09:00", end: "10:00", isAvailable: true }]
        }));

        setAvailableDates(formatted);
        setSelectedTour({
          ...(selectedTour || {}),
          availableDates: response,
        });
      }
    }
    fetchAvailableDates();
  }, [tour?.id]);

  return (
    <div className="min-h-screen bg-[#e6f4f1] text-gray-800">
      <BackButton to="/tours" label="Back to Tours" />
      {/* Hero */}
      <TourHero title={tour?.title as string} />

      {/* Image Gallery + Booking Sidebar */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageGallery images={tour?.images || placeholderImages} />
        </div>

        <div>
          <BookingSidebar
            price={tour?.price as number}
            duration={tour?.duration as number}
            capacity={tour?.capacity as number}
            availableDates={availableDates}
            tour={tour}
          />
        </div>
      </div>

      {/* Itinerary + Included */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Itinerary</h3>
          <Itinerary itinerary={tour?.itinerary || []} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">What’s Included</h3>
          <IncludedSection items={tour?.included || []} />
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed">
          {tour?.description ||
            "Something something something dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        </p>
      </div>

      {/* Image Gallery Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <ImageGalleryGrid images={tour?.images.slice(3) || placeholderImages} />
      </div>
    </div>
  );
}
