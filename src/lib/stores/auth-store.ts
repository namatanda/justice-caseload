/**
 * Authentication Store
 * 
 * Zustand store for managing authentication state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DATA_ENTRY' | 'VIEWER';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) =>
          set(
            { 
              user, 
              isAuthenticated: true, 
              isLoading: false, 
              error: null 
            },
            false,
            'auth/setUser'
          ),

        setLoading: (isLoading) =>
          set({ isLoading }, false, 'auth/setLoading'),

        setError: (error) =>
          set({ error, isLoading: false }, false, 'auth/setError'),

        logout: () =>
          set(
            { 
              user: null, 
              isAuthenticated: false, 
              isLoading: false, 
              error: null 
            },
            false,
            'auth/logout'
          ),

        clearError: () =>
          set({ error: null }, false, 'auth/clearError'),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);