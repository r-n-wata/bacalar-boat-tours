// TourGrid.tsx
import React from "react";

type Tour = {
  id: string;
  title: string;
  image: string;
  price: string;
  duration: string;
};

type Props = {
  tours: Tour[];
};

const TourGrid = ({ tours }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    {tours.map((tour) => (
      <div
        key={tour.id}
        className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
      >
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{tour.title}</h3>
          <p className="text-sm text-gray-600">{tour.duration}</p>
          <p className="text-orange-600 font-bold mt-2">{tour.price}</p>
        </div>
      </div>
    ))}
  </div>
);

export default TourGrid;
