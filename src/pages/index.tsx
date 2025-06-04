"use client";

import React from "react";
import Navbar from "../components/molecules/navbar/Navbar";
import Card from "../components/molecules/card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import PopularTours from "../components/molecules/slider/PopularTours";
import HowItWorks from "../components/organism/HowItWorks";
import { Button } from "../components/atoms/Buttons/button";
import { useRouter } from "next/navigation";
import Footer from "../components/organism/Footer";
import { get } from "http";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../shared/authOptions";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log("session::::::::::::", session);

  return {
    props: { session },
  };
}
const Home = () => {
  const router = useRouter();

  const boatTours = [
    {
      title: "Sunset Lagoon Tour",
      description:
        "Enjoy a relaxing boat ride at sunset with drinks and snacks.",
      image: "/images/background1.jpg",
    },
    {
      title: "Mangrove Eco Adventure",
      description: "Discover hidden ecosystems with our guided eco-tour.",
      image: "/images/background1.jpg",
    },
    {
      title: "Pirate's Channel Cruise",
      description:
        "Sail through the historical Pirate's Channel with local guides.",
      image: "/images/background1.jpg",
    },
    {
      title: "Sunset Lagoon Tour",
      description:
        "Enjoy a relaxing boat ride at sunset with drinks and snacks.",
      image: "/images/background1.jpg",
    },
    {
      title: "Mangrove Eco Adventure",
      description: "Discover hidden ecosystems with our guided eco-tour.",
      image: "/images/background1.jpg",
    },
    {
      title: "Pirate's Channel Cruise",
      description:
        "Sail through the historical Pirate's Channel with local guides.",
      image: "/images/background1.jpg",
    },
  ];

  const restaurants = [
    {
      title: "Mariscos Bacalar",
      description: "Fresh seafood with a beautiful lagoon view.",
      image: "/images/restaurant-mariscos.jpg",
    },
    {
      title: "Taco del Pueblo",
      description: "Authentic Mexican tacos with a local twist.",
      image: "/images/taco-del-pueblo.jpg",
    },
    {
      title: "La Playita",
      description: "Chill vibes, great drinks, and comfy waterside hammocks.",
      image: "/images/la-playita.jpg",
    },
  ];

  const navigateToTour = () => {
    router.push("/public/tours");
  };

  return (
    <div className="bg-white text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="h-[90vh] flex items-center justify-center bg-[url('/images/rename.jpg')] bg-cover bg-center text-white">
        <div className="text-center bg-black bg-opacity-40 p-6 rounded">
          <h1 className="text-5xl font-bold mb-4">
            {" "}
            EXPLORE THE BEAUTY <p>OF BACALAR</p>
          </h1>
          <p className="text-xl mb-6">
            Book your unforgettable tour experience now
          </p>

          <Button variant="primary" onClick={navigateToTour}>
            Find Tours
          </Button>
        </div>
      </section>

      {/* Popular Tours */}
      <PopularTours />

      {/* How It Works */}
      <HowItWorks />

      {/* Boat Tours */}
      <section className="py-32 px-4 md:px-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Boat Tours</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
        >
          {boatTours.map((tour, index) => (
            <SwiperSlide key={index}>
              <Card {...tour} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Restaurants */}
      <section className="py-16 px-4 md:px-16 bg-gray-100">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Where to Eat
        </h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
        >
          {restaurants.map((rest, index) => (
            <SwiperSlide key={index}>
              <Card {...rest} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to book your tour?
        </h2>
        <p className="mb-6">
          Contact us directly on WhatsApp to reserve your spot!
        </p>
        <a
          href="https://wa.me/5219991234567" // replace with your number
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-green-600 transition"
        >
          Message Us on WhatsApp
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
