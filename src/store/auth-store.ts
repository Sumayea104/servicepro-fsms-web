import { create } from 'zustand';
import type { User } from '@/types/api';

interface AuthState {
  user: User | null;
  hydrated: boolean;
  setUser: (user: User | null) => void;
}

// Global client state: the signed-in user. Server state (jobs, payments, ...)
// lives in TanStack Query instead — this store only holds what's genuinely
// client-global, so role-based UI can render without refetching /users/me.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  setUser: (user) => set({ user, hydrated: true }),
}));
