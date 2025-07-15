import React from "react";

interface ItineraryProps {
  itinerary: string[];
}

const Itinerary: React.FC<ItineraryProps> = ({ itinerary }) => (
  <ul className="list-disc list-inside space-y-2 text-gray-700 text-md">
    {itinerary.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export default Itinerary;
