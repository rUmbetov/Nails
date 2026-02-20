'use client';

import { createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { createUserStore } from './userStore';
import type { AccessTokenPayload } from '@/lib/jwt';

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  user: AccessTokenPayload | null;
}

export function UserStoreProvider({ children, user }: Props) {
  const storeRef = useRef<UserStoreApi>();

  // Инициализируем стор только один раз при первом рендере
  if (!storeRef.current) {
    storeRef.current = createUserStore(user);
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
}

// Кастомный хук, который заменяет нам стандартный useUserStore
export function useUser() {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error('useUser должен использоваться внутри UserStoreProvider');
  }

  return useStore(userStoreContext);
}