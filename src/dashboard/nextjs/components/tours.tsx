"use client";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import Sidebar from "../../../components/molecules/dashboard/operator/SideBar";
import Header from "@/components/molecules/dashboard/operator/Header";
import MyToursTable from "@/components/molecules/dashboard/operator/MyToursTable";
import { useEffect, useState } from "react";
import {
  createTour,
  getToursByUser,
  updateTour,
  deleteTour,
  generateUniqueSlug,
} from "../actions";
import { useToast } from "../../../hooks/toast/useToast";
import Toast from "@/components/molecules/toast/toast";
import { supabase } from "@/lib/supabaseClient";
import { useTourStore } from "@/store/tours/useToursStore";
import useSanitizeImages from "@/dashboard/core/useSanitizeImages";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/molecules/loading/LoadingSpinner";
import LoadingOverlay from "@/components/molecules/loading/FullPageLoader";
import { set } from "zod";

export interface Tour {
  id: string;
  operatorId: string;
  title: string;
  slug: string;
  price: number;
  duration: number;
  capacity: number;
  location: string;
  description: string;
  itinerary: string[];
  included: string[];
  images: string[];
  availability: {
    date: string;
    timeSlots: { start: string; end: string; isAvailable: boolean }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Tours({ operatorId }: { operatorId?: string }) {
  const setTours = useTourStore((state) => state.setTours);
  const tours = useTourStore((state) => state.tours);
  const editFormId = useTourStore((state) => state.editTourOpenModal);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    capacity: "",
    location: "",
    description: "",
    itinerary: [] as string[],
    included: [] as string[],
    images: [] as File[],
    availableDates: [] as {
      date: string;
      timeSlots: { start: string; end: string; isAvailable: boolean }[];
    }[],
  });
  const [openAddToursModal, setOpenAddToursModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setEditFromId = useTourStore((state) => state.setEditTourOpenModal);

  const handleToggleModal = (editFormId?: string) => {
    setOpenAddToursModal(!openAddToursModal);
  };

  const { showToast, message, type, isVisible, hideToast } = useToast();
  const sanitizeImages = useSanitizeImages();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);

    try {
      const uploadedImageUrls = await sanitizeImages(formData.images);
      if (!uploadedImageUrls) return;

      // Create sanitized form data to send to server
      const sanitizedForm = {
        ...formData,
        images: uploadedImageUrls,
        availability: formData.availableDates.map((date) => ({
          date: date.date,
          timeSlots: date.timeSlots.map((time) => ({
            start: time.start,
            end: time.end,
            isAvailable: time.isAvailable,
          })),
        })),
      };

      const res = await createTour(operatorId as string, sanitizedForm);

      if (res?.error) {
        showToast("Tour creation failed: " + res.error, "error");
      } else {
        showToast("Tour created successfully!", "success");
        handleToggleModal(); // Close modal after successful creation
        router.refresh();
      }
    } catch (err) {
      console.error("Unhandled error:", err);
      showToast("Unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTour = async () => {
    setIsSubmitting(true);
    try {
      const uploadedImageUrls = await sanitizeImages(formData.images);
      if (!uploadedImageUrls) return;

      const sanitizedForm = {
        ...formData,
        price: formData.price.toString(),
        duration: formData.duration.toString(),
        capacity: formData.capacity.toString(),

        images: uploadedImageUrls,
        availability: formData.availableDates.map((date) => ({
          date: date.date,
          timeSlots: date.timeSlots.map((time) => ({
            start: time.start,
            end: time.end,
            isAvailable: time.isAvailable,
          })),
        })),
      };

      const res = await updateTour(
        operatorId as string,
        editFormId,
        sanitizedForm
      );
      if (res?.error) {
        showToast("Tour update failed: " + res.error, "error");
      } else {
        showToast("Tour updated successfully!", "success");

        router.refresh();
      }
    } catch (err) {
      console.error("Unhandled error:", err);
      showToast("Unexpected error occurred", "error");
    } finally {
      setEditFromId("");
      handleToggleModal();
      setIsSubmitting(false);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    try {
      const res = await deleteTour(tourId);
      if (res?.error) {
        showToast("Tour deletion failed: " + res.error, "error");
      } else {
        showToast("Tour deleted successfully!", "success");
        router.refresh();
      }
    } catch (err) {
      console.error("Unhandled error:", err);
      showToast("Unexpected error occurred", "error");
    }
  };

  useEffect(() => {
    async function fetchTours() {
      setIsLoading(true);
      const res = await getToursByUser(operatorId as string);
      if (res?.error) {
        showToast("Error fetching tours", "error");
      } else {
        setTours(res.tours as Tour[]);
      }
      setIsLoading(false);
    }

    console.log("getting all tours");
    fetchTours();
  }, []);

  if (isLoading) {
    return <LoadingOverlay text="Loading your tours..." />;
  }

  if (isSubmitting) {
    return <LoadingOverlay text="Submitting form..." />;
  }

  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen bg-gray-100">
          <Header
            handleSubmit={handleSubmit}
            setFormData={setFormData}
            formData={formData}
            handleUpdateTour={handleUpdateTour}
            handleToggleModal={handleToggleModal}
            openAddToursModal={openAddToursModal}
          />
          <section className="p-6 space-y-6">
            <MyToursTable tours={tours} handleDeleteTour={handleDeleteTour} />
          </section>
        </main>
      </div>

      <Toast
        message={message}
        type={type}
        isVisible={isVisible}
        onClose={hideToast}
      />
    </>
  );
}
