import {create} from 'zustand';

interface User {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | null | undefined;
  image:  string | null | undefined;
  id: string;
  role: "ADMIN" | "USER";
  isTwoFactorEnabled: boolean;
  userFormCompleted : boolean;
  onBoardingCompleted : boolean;
  isOAuth: boolean;
}

interface UserState {
  user: User | null;
  setUser: (user: Partial<User>) => void;
  updateUserImage: (image: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set((state) => ({
    user: {
      ...state.user,
      ...user,
      email: user.email || state.user?.email || '', // Ensure email is always a string
    } as User,
  })),
  updateUserImage: (image) => set((state) => ({
    user: state.user ? { ...state.user, image } : null,
  })),
}));
