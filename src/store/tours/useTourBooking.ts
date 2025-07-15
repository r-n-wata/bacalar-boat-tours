import { create } from "zustand";
import { Tour } from "@/dashboard/nextjs/components/tours";

interface TourStore {
  selectedTour: Record<string, any>;
  selectedTime: Record<string, any>;
  setSelectedTour: (tour: Record<string, any>) => void;
  clearSeclectedTour: () => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: Record<string, any>) => void;
  clearSelectedDate: () => void;
  booking: Record<string, any>;
  setBooking: (booking: Record<string, any>) => void;
  clearBooking: () => void;
}

export const useTourStore = create<TourStore>((set) => ({
  selectedTour: {} as Tour,
  selectedDate: null,
  selectedTime: {},
  booking: {},
  setBooking: (booking) => set({ booking }),
  clearBooking: () => set({ booking: {} }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  clearSelectedDate: () => set({ selectedDate: undefined }),
  setSelectedTour: (tour) => set({ selectedTour: tour }),
  clearSeclectedTour: () => set({ selectedTour: {} }), // Add this line
  clearTours: () => set({}),
}));
