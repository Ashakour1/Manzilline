import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setHydrated: () => void;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isHydrated: false,
  login: () => {},
  logout: () => {},
  setHydrated: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      isLoggedIn: false,
      login: (user: User) => set({ user, isLoggedIn: true, isHydrated: true }),
      logout: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        set({ user: null, isLoggedIn: false, isHydrated: true });
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "landlord_auth_store",
      onRehydrateStorage: () => (state) => {
        // Set isLoggedIn based on whether user exists after rehydration
        if (state) {
          state.isLoggedIn = !!state.user;
          state.setHydrated();
        }
      },
    }
  )
);
