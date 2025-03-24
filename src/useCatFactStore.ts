import { create } from "zustand";

interface CatFactStore {
  fact: string;
  setFact: (newFact: string) => void;
}

export const useCatFactStore = create<CatFactStore>((set) => ({
  fact: "",
  setFact: (newFact: string) => set({ fact: newFact }),
}));
