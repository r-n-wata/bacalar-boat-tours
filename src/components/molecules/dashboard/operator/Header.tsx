"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import AddTourForm from "./AddTourForm";
import { useTourStore } from "@/store/tours/useToursStore";

export default function Header({
  handleSubmit,
  setFormData,
  formData,
  handleUpdateTour,
  handleToggleModal,
  openAddToursModal,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
  handleUpdateTour: (data: any) => void;
  handleToggleModal: (editFormId?: string) => void;
  openAddToursModal: boolean;
}) {
  const tours = useTourStore((state) => state.tours);
  const editFormId = useTourStore((state) => state.editTourOpenModal);

  const [dataToEdit, setDataToEdit] = useState({});

  useEffect(() => {
    const editTour = tours.find((tour) => tour.id === editFormId);
    if (editTour?.id === editFormId) {
      setDataToEdit(editTour);
      setFormData({
        title: editTour.title,
        price: editTour.price,
        duration: editTour.duration,
        capacity: editTour.capacity,
        location: editTour.location,
        description: editTour.description,
        itinerary: editTour.itinerary,
        included: editTour.included,
        images: editTour.images,
        availableDates: editTour.availability,
      });
      handleToggleModal(editFormId);
    }
    if (!editFormId) {
      setDataToEdit({});
    }
  }, [editFormId]);

  return (
    <header className="bg-teal-700 text-white p-4 flex justify-between items-center">
      <div>
        <button
          onClick={() => handleToggleModal()}
          className="bg-[#027373] text-white px-4 py-2 rounded hover:bg-[#025d5d]"
        >
          + Add New Tour
        </button>

        <Modal
          isOpen={openAddToursModal}
          onClose={handleToggleModal}
          title=""
          setFormData={setFormData}
        >
          <AddTourForm
            submitForm={handleSubmit}
            setFormData={setFormData}
            formData={formData}
            dataToEdit={dataToEdit}
            handleUpdateTour={handleUpdateTour}
          />
        </Modal>
      </div>
    </header>
  );
}
