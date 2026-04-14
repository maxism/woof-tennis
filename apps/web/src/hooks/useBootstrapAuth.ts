import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getTelegramInitData, isTelegramMiniApp } from '@/utils/telegram';
import { fetchMeWithToken } from '@/api/users';
import { AUTH_ENDPOINTS } from '@/auth/authEndpoints';

async function bootstrapAuth(): Promise<void> {
  const { login, setSession, applyAuthFailure, setLoading, token } =
    useAuthStore.getState();

  /** Внутренняя отладка (docs/15 §7 — в UI не рекламируем). */
  const dev = import.meta.env.VITE_DEV_ACCESS_TOKEN;
  if (dev?.trim()) {
    const t = dev.trim();
    try {
      const me = await fetchMeWithToken(t);
      setSession(t, me);
    } catch (e: unknown) {
      applyAuthFailure(e, AUTH_ENDPOINTS.me);
    }
    setLoading(false);
    return;
  }

  const initData = getTelegramInitData();
  if (isTelegramMiniApp() && initData) {
    await login(initData);
    return;
  }

  if (token) {
    try {
      const me = await fetchMeWithToken(token);
      setSession(token, me);
    } catch (e: unknown) {
      applyAuthFailure(e, AUTH_ENDPOINTS.me);
    }
  }

  setLoading(false);
}

export function useBootstrapAuth(): void {
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      void bootstrapAuth();
      return;
    }
    return useAuthStore.persist.onFinishHydration(() => {
      void bootstrapAuth();
    });
  }, []);
}
