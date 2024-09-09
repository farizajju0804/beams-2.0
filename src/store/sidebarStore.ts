// Importing the `create` function from Zustand to create the store
import { create } from 'zustand';

// Defining the interface for the sidebar's state and actions
interface SidebarState {
  isOpen: boolean; // A boolean indicating if the sidebar is open
  toggleSidebar: () => void; // A function to toggle the sidebar's state
}

// Creating the Zustand store with the initial state and actions
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true, // Initial state, the sidebar is open by default
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })), // Action to toggle the sidebar's `isOpen` state
}));
