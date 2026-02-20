import { create } from 'zustand';
import type { User } from '../types/auth';
import * as authApi from '../api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authApi.login({ email, password });
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ログインに失敗しました';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authApi.register({
        email,
        password,
        displayName,
      });
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : '登録に失敗しました';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));
