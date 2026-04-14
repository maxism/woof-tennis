import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserWithStats } from '@wooftennis/shared';
import {
  loginWithTelegram,
  loginWithTelegramWidget,
  type TelegramWidgetAuthPayload,
} from '@/api/auth';
import { fetchMeWithToken } from '@/api/users';
import { AUTH_ENDPOINTS } from '@/auth/authEndpoints';
import type { AuthFailureKind } from '@/auth/authFailureKind';
import { buildAuthFailureState } from '@/auth/buildAuthFailureState';

interface AuthState {
  token: string | null;
  user: UserWithStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  authFailureKind: AuthFailureKind | null;
  authRequestId: string | null;
  login: (initData: string) => Promise<void>;
  loginWithWidget: (payload: TelegramWidgetAuthPayload) => Promise<void>;
  setSession: (token: string, user: UserWithStats) => void;
  applyAuthFailure: (error: unknown, endpoint: string) => void;
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
      authFailureKind: null,
      authRequestId: null,

      applyAuthFailure: (error, endpoint) => {
        const f = buildAuthFailureState(error, endpoint);
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          ...f,
        });
      },

      setSession: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          authError: null,
          authFailureKind: null,
          authRequestId: null,
        });
      },

      login: async (initData: string) => {
        set({
          isLoading: true,
          authError: null,
          authFailureKind: null,
          authRequestId: null,
        });
        try {
          const { accessToken } = await loginWithTelegram(initData);
          try {
            const me = await fetchMeWithToken(accessToken);
            set({
              token: accessToken,
              user: me,
              isAuthenticated: true,
              isLoading: false,
              authError: null,
              authFailureKind: null,
              authRequestId: null,
            });
          } catch (e: unknown) {
            get().applyAuthFailure(e, AUTH_ENDPOINTS.me);
          }
        } catch (e: unknown) {
          get().applyAuthFailure(e, AUTH_ENDPOINTS.miniApp);
        }
      },

      loginWithWidget: async (payload: TelegramWidgetAuthPayload) => {
        set({
          isLoading: true,
          authError: null,
          authFailureKind: null,
          authRequestId: null,
        });
        try {
          const { accessToken } = await loginWithTelegramWidget(payload);
          try {
            const me = await fetchMeWithToken(accessToken);
            set({
              token: accessToken,
              user: me,
              isAuthenticated: true,
              isLoading: false,
              authError: null,
              authFailureKind: null,
              authRequestId: null,
            });
          } catch (e: unknown) {
            get().applyAuthFailure(e, AUTH_ENDPOINTS.me);
          }
        } catch (e: unknown) {
          get().applyAuthFailure(e, AUTH_ENDPOINTS.widget);
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          authError: null,
          authFailureKind: null,
          authRequestId: null,
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
