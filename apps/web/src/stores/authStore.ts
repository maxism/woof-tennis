import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserWithStats } from '@wooftennis/shared';
import { loginWithTelegram } from '@/api/auth';
import { fetchMeWithToken } from '@/api/users';

interface AuthState {
  token: string | null;
  user: UserWithStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (initData: string) => Promise<void>;
  setSession: (token: string, user: UserWithStats) => void;
  logout: () => void;
  updateUser: (data: Partial<UserWithStats>) => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      authError: null,

      setSession: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          authError: null,
        });
      },

      login: async (initData: string) => {
        set({ isLoading: true, authError: null });
        try {
          const { accessToken } = await loginWithTelegram(initData);
          const me = await fetchMeWithToken(accessToken);
          set({
            token: accessToken,
            user: me,
            isAuthenticated: true,
            isLoading: false,
            authError: null,
          });
        } catch (e: unknown) {
          const msg =
            e && typeof e === 'object' && 'message' in e
              ? String((e as { message?: string }).message)
              : 'Auth failed';
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            authError: msg,
          });
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          authError: null,
        });
      },

      updateUser: (data) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, ...data } });
      },

      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: 'wooftennis-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && state.user) {
          state.isAuthenticated = true;
        }
        state?.setLoading(false);
      },
    },
  ),
);
