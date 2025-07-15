"use client";

import React from "react";
import { X } from "lucide-react"; // or use any icon library you like
import { useTourStore } from "@/store/tours/useToursStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  setFormData, // Assuming this is used in the children components
}: ModalProps) {
  const editFormId = useTourStore((state) => state.editTourOpenModal);
  const setEditFromId = useTourStore((state) => state.setEditTourOpenModal);

  if (!isOpen) return null;

  const handleOnClose = () => {
    onClose();
    setEditFromId("");
    setFormData({});
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleOnClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {title && (
          <h2 className="text-xl font-semibold mb-4 text-[#042B2E]">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
}
