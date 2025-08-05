import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useTranslation } from "react-i18next";
import MobileToursSlider from "./MobileSlider";

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

export default function PopularToursSlider() {
  const { t } = useTranslation();

  return (
    <div className="py-8 ps-4 md:py-32  md:px-16 lg:px-40 sm:py-28  bg-white sm:mb-10 border-b-14 border-gray-300">
      <h2
        className="
    text-2xl sm:text-3xl md:text-4xl 
    font-bold 
    text-left lg:text-center 
    text-primary 
    mb-2 sm:mb-6 md:mb-8
  "
      >
        {t("POPULAR_TOURS")}
      </h2>

      <p
        className="
    text-sm sm:text-base md:text-lg 
    text-gray-600 
    leading-relaxed 
    max-w-xl md:max-w-2xl 
    text-left lg:text-center 
    mx-auto sm:px-4
    mb-4
  "
      >
        {t("POPULAR_TOURS_DESC")}
      </p>

      {/* Mobile/Tablet Swipe-Only */}
      <div className="md:hidden pb-10">
        <MobileToursSlider tours={tours} />
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
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
