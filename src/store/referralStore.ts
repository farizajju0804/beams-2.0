import {create} from 'zustand';

interface ReferralModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useReferralModalStore = create<ReferralModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));