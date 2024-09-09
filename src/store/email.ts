// Importing the create function from Zustand to create the store
import { create } from "zustand";

// Defining the interface for the email store's state and actions
interface Email {
  email: string | null; // The email state, initially set to null
  setEmail: (email: string) => void; // Function to update the email
}

// Creating the Zustand store with the initial state and actions
export const useEmailStore = create<Email>((set) => ({
  email: null, // Initial value for the email is set to null
  setEmail: (email) => set({ email }), // Action to update the email state
}));
