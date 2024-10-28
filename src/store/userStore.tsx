// Importing the `create` function from Zustand to create the store
import { ReferralStatus } from '@prisma/client';
import { create } from 'zustand';

// Defining the interface for the user's data
interface User {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  id: string;
  role: "ADMIN" | "USER";
  isTwoFactorEnabled: boolean;
  userFormCompleted: boolean;
  onBoardingCompleted: boolean;
  beams?: number;  // Total points (beams)
  level?: number;  // User's current level
  levelName?: string;  // Name of the current level
  referredById?: string | null,
  referralStatus?: ReferralStatus | null,
}

// Defining the interface for the user's state and actions in the store
interface UserState {
  user: User | null;
  setUser: (user: Partial<User>) => void;
  updateUserImage: (image: string) => void;
}

// Creating the Zustand store with the initial state and actions
export const useUserStore = create<UserState>((set) => ({
  user: null,
  
  // Action to set or update the user's data
  setUser: (user) => set((state) => ({
    user: {
      ...state.user,
      ...user,
      email: user.email || state.user?.email || '',
    } as User,
  })),
  
  // Action to update only the user's profile image
  updateUserImage: (image) => set((state) => ({
    user: state.user ? { ...state.user, image } : null,
  })),
}));
