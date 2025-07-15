import React from "react";

interface TourDetailsProps {
  price: string;
  duration: string;
  people: string;
  location: string;
  dates: string[];
}

const TourDetails: React.FC<TourDetailsProps> = ({
  price,
  duration,
  people,
  location,
  dates,
}) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{price}</h2>
      <p>{duration}</p>
      <p>{people}</p>
      <p className="font-semibold">{location}</p>
      <div>
        <p className="font-semibold">Available Dates:</p>
        <ul className="list-disc list-inside">
          {dates.map((date, i) => (
            <li key={i}>{date}</li>
          ))}
        </ul>
      </div>
      <button className="mt-4 bg-teal-800 text-white px-6 py-2 rounded hover:bg-teal-700 transition">
        Book Now
      </button>
    </div>
  );
};

export default TourDetails;
