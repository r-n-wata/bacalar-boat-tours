"use client";

import React, { useState, useEffect } from "react";
import SearchAndFilterBar from "@/components/molecules/searchAndFilter/SearchAndFilterBar";
import { getAllTours, getMostPopularTours } from "../actions";
import { Tour } from "@/dashboard/nextjs/components/tours";
import Link from "next/link";
import MobileToursSlider from "@/components/molecules/slider/MobileSlider";

interface BoatToursPageProps {
  userId?: string;
}

const BoatToursPage = ({ userId }: BoatToursPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ duration: "", price: "", type: "" });
  const [tours, setTours] = useState<Tour[]>();
  const [popularTours, setPopularTours] = useState<Tour[]>();

  const filteredTours =
    tours &&
    tours.length > 0 &&
    tours
      .filter((tour) =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((tour) => {
        const formatTour = {
          ...tour,
          duration: tour.duration.toString(),
          price: tour.price.toString(),
        };
        if (filters.duration && !formatTour.duration.includes(filters.duration))
          return false;
        if (
          filters.price === "low" &&
          parseInt(formatTour.price.slice(1)) >= 100
        )
          return false;
        if (
          filters.price === "mid" &&
          (parseInt(formatTour.price.slice(1)) < 100 ||
            parseInt(formatTour.price.slice(1)) > 300)
        )
          return false;
        if (
          filters.price === "high" &&
          parseInt(formatTour.price.slice(1)) <= 300
        )
          return false;
        return true;
      });

  useEffect(() => {
    async function fetchData() {
      const res = await getAllTours();
      if (res.success) setTours(res.tours as Tour[]);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await getMostPopularTours();
      if (res.success) {
        const tours = res.popularTours.slice(0, 3);
        setPopularTours(tours as unknown as Tour[]);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/images/tours-background.jpg')] bg-cover bg-center relative">
      {/* Optional background overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 ps-4 md:px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16 flex flex-col items-center">
        {/* Filter Bar */}
        <div className="w-full max-w-5xl mb-6 sm:mb-8">
          <SearchAndFilterBar
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Popular Tours */}
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">
          Popular Tours
        </h2>
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-12">
          {Array.isArray(popularTours) &&
            popularTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
              >
                <Link href={`/tours/tour/${tour.slug}`}>
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-48 sm:h-56 md:h-60 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {tour.title}
                  </h3>
                  <p className="text-orange-600 text-base sm:text-lg font-semibold">
                    {tour.price}
                  </p>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {tour.duration}
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div className="md:hidden block w-full">
          <MobileToursSlider tours={popularTours || []} />
        </div>

        {/* All Tours */}
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">
          All Tours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full pe-4">
          {Array.isArray(filteredTours) &&
            filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
              >
                <Link href={`/tours/tour/${tour.slug}`}>
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-48 sm:h-56 md:h-60 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {tour.title}
                  </h3>
                  <p className="text-orange-600 text-base sm:text-lg font-semibold">
                    {tour.price}
                  </p>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {tour.duration}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BoatToursPage;
