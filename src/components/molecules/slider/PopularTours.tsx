// import Swiper styles and modules
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

const tours = [
  {
    title: "Sunrise Sailing Tour",
    description: "Experience the lagoon at dawn.",
    price: "$75 per person",
    duration: "3 hours",
    image: "/images/boat1.jpg",
  },
  {
    title: "Eco-Friendly Lagoon Cruise",
    description: "Discover Bacalar with a sustainable focus.",
    price: "$50 per person",
    duration: "2.5 hours",
    image: "/images/background1.jpg",
  },
  {
    title: "Private Cenote Tour",
    description: "Visit secluded cenotes in comfort.",
    price: "$120 per person",
    duration: "4 hours",
    image: "/images/boat1.jpg",
  },
];

/**
 * A slider for popular tours.
 *
 * @returns A Swiper component with slides for three popular tours.
 */
export default function PopularToursSlider() {
  return (
    <div className="px-40 py-28 bg-cream">
      <h2 className="text-3xl font-bold text-center text-primary mb-12">
        Popular Tours
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tours.map((tour, idx) => (
          <div
            key={idx}
            className="rounded-xl shadow-lg overflow-hidden bg-white"
          >
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-semibold text-primary">
                {tour.title}
              </h3>
              <p className="text-gray-600">{tour.description}</p>
              <p className="text-primary font-bold">{tour.price}</p>
              <p className="text-sm text-gray-500">⏱ {tour.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
