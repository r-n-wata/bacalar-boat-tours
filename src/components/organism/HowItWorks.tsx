import React from "react";

function HowItWorks() {
  return (
    <div className=" py-32 bg-white text-center px-40 ">
      <h2 className="text-3xl font-bold text-primary mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <div key={idx} className="flex flex-col items-center space-y-4">
            <div className="text-5xl">{step.icon}</div>
            <h3 className="text-lg font-semibold text-primary mb-6">
              {step.title}
            </h3>
            <p className="text-gray-600 px-10">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
