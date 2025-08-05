"use client";

import DynamicChecklistField from "@/components/atoms/DynamicsChecklist";
import { useState } from "react";
import ImageDropzone from "./ImageDropZone";
import AvailableDatesWithTimesPicker from "./AvailableDatesWithTimesPicker";
import MultiTimeSlotPicker from "./MultiTimeSlotPicker"; // update path as needed
import { calculateEndTime } from "./utils";
import { useTranslation } from "react-i18next";

export default function AddTourForm({
  submitForm,
  setFormData,
  formData,
  dataToEdit,
  handleUpdateTour,
}: {
  submitForm: (data: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
  dataToEdit?: any;
  handleUpdateTour: (data: any) => void;
}) {
  const { t } = useTranslation();
  const handleItineraryChange = (newList: string[]) => {
    setFormData((prev: any) => ({ ...prev, itinerary: newList }));
  };

  const handleIncludedChange = (newList: string[]) => {
    setFormData((prev: any) => ({ ...prev, included: newList }));
  };

  const handleTimeSlotsChange = (newList: string[]) => {
    setFormData((prev: any) => ({ ...prev, timeSlots: newList }));
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (dataToEdit.id) {
      handleUpdateTour(formData);
    } else {
      submitForm(formData);
    }
  }

  const preParsedDates = (
    dataToEdit?.availableDates ||
    formData.availableDates ||
    []
  ).map((d: any) => (d instanceof Date ? d : new Date(d)));

  const selectedDatesCount =
    formData?.availableDates?.length ?? dataToEdit?.availableDates?.length ?? 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl bg-white p-8 rounded-lg shadow-md space-y-6 text-[#042B2E]"
    >
      <h2 className="text-2xl font-semibold text-[#042B2E]">Add a New Tour</h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Tour Title</label>
        <input
          type="text"
          name="title"
          value={formData?.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
          required
        />
      </div>

      {/* Price & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (USD)</label>
          <input
            type="number"
            name="price"
            value={formData?.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (hours)
          </label>
          <input
            type="number"
            name="duration"
            value={formData?.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
      </div>

      {/* Capacity & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Max People</label>
          <input
            type="number"
            name="capacity"
            value={formData?.capacity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData?.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={
            dataToEdit.description
              ? dataToEdit.description
              : formData?.description
          }
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2 h-24"
          required
        />
      </div>

      <DynamicChecklistField
        label="Itinerary"
        placeholder="Add a step..."
        onChange={handleItineraryChange}
        values={dataToEdit.itinerary}
      />

      <DynamicChecklistField
        label="What's Included"
        placeholder="Add a step..."
        onChange={handleIncludedChange}
        values={dataToEdit.included}
      />

      {/* Available Dates */}
      <div>
        <AvailableDatesWithTimesPicker
          value={formData.availableDates ?? []}
          duration={formData?.duration ?? 0}
          onChange={(datesWithTimes) =>
            setFormData((prev: any) => ({
              ...prev,
              availableDates: datesWithTimes,
            }))
          }
        />

        {selectedDatesCount > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            {selectedDatesCount} date{selectedDatesCount > 1 ? "s" : ""}{" "}
            selected
          </p>
        )}
      </div>

      <ImageDropzone
        onDrop={(files) =>
          setFormData((prev: any) => ({
            ...prev,
            images: [...(prev.images || []), ...files], // append instead of replace
          }))
        }
        selectedImages={formData?.images}
      />

      <button
        type="submit"
        className="bg-[#027373] text-white px-6 py-2 rounded hover:bg-[#025d5d]"
      >
        {dataToEdit.id ? t("UPDATE_TOUR") : t("ADD_TOUR")}
      </button>
    </form>
  );
}
