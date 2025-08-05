// components/MobileToursSlider.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface Tour {
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
}

export default function MobileToursSlider({ tours }: { tours: Tour[] }) {
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView="auto"
      grabCursor={true}
      freeMode={true}
      touchStartPreventDefault={false}
      className="h-[320px] sm:h-[340px]"
    >
      {tours.map((tour, idx) => (
        <SwiperSlide
          key={idx}
          className="!w-[70%] sm:!w-[60%] flex-shrink-0 h-full  py-4 md:mb-0 "
        >
          <div className="flex flex-col h-full rounded-xl shadow-lg  overflow-hidden bg-white">
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-48 object-cover flex-shrink-0"
            />
            <div className="flex flex-col flex-grow p-4">
              <h3 className="text-lg font-semibold text-primary overflow-hidden whitespace-nowrap">
                {tour.title}
              </h3>
              <p className="text-gray-600 text-sm flex-grow overflow-hidden whitespace-nowrap">
                {tour.description}
              </p>
              <div className="mt-auto">
                <p className="text-primary font-bold text-sm overflow-hidden whitespace-nowrap">
                  {tour.price}
                </p>
                <p className="text-xs text-gray-500 overflow-hidden whitespace-nowrap">
                  ⏱ {tour.duration}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
