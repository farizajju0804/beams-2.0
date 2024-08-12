import {create} from "zustand";

interface Email {
  email: string | null;
  setEmail: (email: string) => void;
}

export const useEmailStore = create<Email>((set) => ({
  email: null,
  setEmail: (email) => set({ email }),
}));
