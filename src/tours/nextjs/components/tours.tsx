"use client";

// BoatToursPage.tsx
import React, { useState, useEffect } from "react";
//import PageHeader from "./PageHeader";

import SearchAndFilterBar from "@/components/molecules/searchAndFilter/SearchAndFilterBar";
import TourGrid from "@/components/molecules/grid/tour/TourGrid";
import Pagination from "@/components/molecules/Pagination";
import mockTours from "@/data/mockTours";
import { getAllTours, getMostPopularTours } from "../actions";
import { set } from "zod";
import { Tour } from "@/dashboard/nextjs/components/tours";
import Link from "next/link";

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
      if (res.success) {
        // set state, etc.
        setTours(res.tours as Tour[]);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await getMostPopularTours();
      if (res.success) {
        // set state, etc.
        const tours = res.popularTours.slice(0, 3);
        setPopularTours(tours as unknown as Tour[]);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[url('/images/tours-background.jpg')] bg-cover bg-center p-6 flex flex-col items-center">
        {/* Filter Bar */}
        <SearchAndFilterBar
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
        />

        {/* Popular Tours */}
        <h2 className="text-white text-4xl font-bold text-center mb-8">
          Popular Tours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {Array.isArray(popularTours) &&
            popularTours.slice(0, 3).map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                {" "}
                <Link href={`/tours/tour/${tour.slug}`}>
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-60 object-cover"
                  />{" "}
                </Link>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {tour.title}
                  </h3>
                  <p className="text-orange-600 text-lg font-semibold">
                    {tour.price}
                  </p>
                  <p className="text-gray-500">{tour.duration}</p>
                </div>
              </div>
            ))}
        </div>

        {/* All Tours */}
        <h2 className="text-white text-4xl font-bold text-center mb-8">
          All Tours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array.isArray(filteredTours) &&
            filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <Link href={`/tours/tour/${tour.slug}`}>
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-60 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {tour.title}
                  </h3>
                  <p className="text-orange-600 text-lg font-semibold">
                    {tour.price}
                  </p>
                  <p className="text-gray-500">{tour.duration}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default BoatToursPage;
