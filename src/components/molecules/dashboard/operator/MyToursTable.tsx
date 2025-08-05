import { useTourStore } from "@/store/tours/useToursStore";
import React from "react";
import { useTranslation } from "react-i18next";

type Tour = {
  id: number;
  image: string;
  name: string;
  price: number;
  bookings: number;
};

const toursMock: Tour[] = [
  {
    id: 1,
    image: "/placeholder.png", // Replace with actual image URL or import
    name: "Tour 1",
    price: 35,
    bookings: 3,
  },
  {
    id: 2,
    image: "/placeholder.png",
    name: "Tour 2",
    price: 50,
    bookings: 5,
  },
  {
    id: 3,
    image: "/placeholder.png",
    name: "Tour 3",
    price: 40,
    bookings: 2,
  },
];

export default function MyToursTable({
  setOpenEditModal,
  tours,
  handleDeleteTour,
}: any) {
  const { t } = useTranslation();
  const open = useTourStore((state) => state.editTourOpenModal);
  const setEdit = useTourStore((state) => state.setEditTourOpenModal);
  const handleEdit = (id: number) => {
    setEdit(id + "");
  };

  const handleDelete = (id: number) => {
    handleDeleteTour(id);
  };

  return (
    <div className="bg-[#FDF8F3] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-[#042B2E]">My Tours</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#FFF2E7] text-[#042B2E]">
            <tr>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr
                key={tour.id}
                className="border-t border-gray-200 text-gray-500 "
              >
                <td className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-10 h-10 object-cover rounded-md bg-gray-100"
                  />
                  {tour.title}
                  <span className="font-medium">{tour.name}</span>
                </td>
                <td className="px-4 py-3">
                  ${tour.price}{" "}
                  <span className="text-gray-500 text-xs">per person</span>
                </td>
                <td className="px-4 py-3">{tour.bookings}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    className="px-3 py-1 rounded bg-[#E6F4F1] text-sm text-[#027373] hover:bg-[#d0ebe8]"
                    onClick={() => handleEdit(tour.id)}
                  >
                    {t("EDIT")}
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-[#FBEAEA] text-sm text-[#D94141] hover:bg-[#f7dcdc]"
                    onClick={() => handleDelete(tour.id)}
                  >
                    {t("DELETE")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
