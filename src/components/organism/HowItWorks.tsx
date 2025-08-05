import React from "react";

function HowItWorks() {
  return (
    <div className="py-16 sm:py-0 md:py-32 bg-white text-center px-4 sm:px-8 md:px-16 lg:px-40 border-b-14 border-gray-300">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8 sm:mb-12">
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
        {[
          {
            icon: "📍",
            title: "1. Choose a Tour",
            desc: "Browse our selection of tours",
          },
          {
            icon: "📅",
            title: "2. Book Online",
            desc: "Select your dates and make your reservation",
          },
          {
            icon: "⛵",
            title: "3. Enjoy the Lagoon",
            desc: "Experience Bacalar with our expert guides",
          },
        ].map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center space-y-3 sm:space-y-4 px-4"
          >
            <div className="text-4xl sm:text-5xl">{step.icon}</div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-xs mx-auto">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
