// Importing the `create` function from Zustand to create the store
import { create } from 'zustand';

// Defining the interface for the user's data
interface User {
  firstName?: string | null | undefined; // Optional first name, can be a string or null/undefined
  lastName?: string | null | undefined;  // Optional last name, can be a string or null/undefined
  email?: string | null | undefined;     // Optional email, can be a string or null/undefined
  image: string | null | undefined;      // User's profile image, can be null/undefined
  id: string;                            // User's unique ID, always required
  role: "ADMIN" | "USER";                // User's role, either "ADMIN" or "USER"
  isTwoFactorEnabled: boolean;           // Indicates if two-factor authentication is enabled
  userFormCompleted: boolean;            // Indicates if the user form has been completed
  onBoardingCompleted: boolean;          // Indicates if onboarding has been completed
  isOAuth: boolean;                      // Indicates if the user logged in through OAuth
}

// Defining the interface for the user's state and actions in the store
interface UserState {
  user: User | null;                     // The current user's data, or null if not set
  setUser: (user: Partial<User>) => void; // Function to set/update the user's data
  updateUserImage: (image: string) => void; // Function to update the user's profile image
}

// Creating the Zustand store with the initial state and actions
export const useUserStore = create<UserState>((set) => ({
  user: null, // Initial state: no user is set (null)
  
  // Action to set or update the user's data
  setUser: (user) => set((state) => ({
    user: {
      ...state.user,                      // Preserve the existing user data
      ...user,                            // Overwrite with new user data
      email: user.email || state.user?.email || '', // Ensure email is always set to a string
    } as User,                            // Cast to the User type
  })),
  
  // Action to update only the user's profile image
  updateUserImage: (image) => set((state) => ({
    user: state.user ? { ...state.user, image } : null, // If user exists, update the image
  })),
}));
