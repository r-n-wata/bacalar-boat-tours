// Pagination.tsx
import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => (
  <div className="flex justify-center p-4">
    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`mx-1 px-4 py-2 border rounded ${
          currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
);

export default Pagination;
