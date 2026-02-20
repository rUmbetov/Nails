import { createStore } from 'zustand';
import type { AccessTokenPayload } from '@/lib/jwt';

export interface UserState {
  user: AccessTokenPayload | null;
  setUser: (user: AccessTokenPayload | null) => void;
}

export const createUserStore = (initialUser: AccessTokenPayload | null = null) => {
  return createStore<UserState>()((set) => ({
    user: initialUser,
    setUser: (user) => set({ user }),
  }));
};