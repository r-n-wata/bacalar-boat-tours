"use client";
import { useTranslation } from "react-i18next";

interface Tour {
  name: string;
  date: string;
}

export default function ToursTable({ tours }: { tours: Tour[] }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t("TOURS")}</h3>

      {/* Desktop Table */}
      <table className="hidden min-w-full text-left md:table">
        <thead className="text-gray-600">
          <tr>
            <th className="pb-2">{t("TOUR")}</th>
            <th className="pb-2">{t("DATE")}</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour, index) => (
            <tr key={index} className="border-t text-gray-500">
              <td className="py-2">{tour.name}</td>
              <td>{tour.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {tours.map((tour, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 shadow-sm flex flex-col gap-1"
          >
            <p className="text-gray-800 font-semibold">{tour.name}</p>
            <p className="text-gray-500 text-sm">
              <span className="font-medium">{t("DATE")}:</span> {tour.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
