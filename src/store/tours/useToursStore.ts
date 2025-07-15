// stores/useTourStore.ts
import { create } from "zustand";
import { Tour } from "@/dashboard/nextjs/components/tours";

interface TourStore {
  tours: Tour[];
  setTours: (tours: Tour[]) => void;
  addTour: (tour: Tour) => void;
  clearTours: () => void;
  editTourOpenModal: string;
  setEditTourOpenModal: (id: string) => void;
}

export const useTourStore = create<TourStore>((set) => ({
  tours: [],
  editTourOpenModal: "",
  setTours: (tours) => set({ tours }),
  addTour: (tour) => set((state) => ({ tours: [...state.tours, tour] })),
  clearTours: () => set({ tours: [] }),
  setEditTourOpenModal: (id) => set({ editTourOpenModal: id }),
}));
