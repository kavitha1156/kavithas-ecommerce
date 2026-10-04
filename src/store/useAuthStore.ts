import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SELLER';
  avatar?: string;
}

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  switchRole: (role: 'USER' | 'ADMIN' | 'SELLER') => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: {
        id: "usr-admin-1",
        name: "Store Owner (Admin)",
        email: "admin@kavithas-store.com",
        role: "ADMIN",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      },
      isAuthenticated: true,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      switchRole: (role) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, role } });
        }
      },
    }),
    {
      name: `kavithas-auth-session`,
    }
  )
);
