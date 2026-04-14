import type { AuthFailureKind } from './authFailureKind';
import type { NormalizedAuthFailure } from './normalizeAuthFailure';

/**
 * Событие телеметрии auth-сбоев (схема для QA / будущей аналитики).
 *
 * - `event`: всегда `auth_failure`
 * - `endpoint`: относительный путь (`/auth/telegram`, `/auth/telegram/widget`, `/users/me`)
 * - `kind`: нормализованный класс ошибки
 * - `httpStatus`: если был HTTP-ответ
 * - `requestId`: из JSON `requestId` или заголовка (если бэкенд отдал)
 * - `detail`: краткое техническое описание (без секретов)
 */
export type AuthTelemetryEvent = {
  event: 'auth_failure';
  endpoint: string;
  kind: AuthFailureKind;
  httpStatus?: number;
  requestId?: string;
  detail?: string;
};

function safeDispatch(detail: AuthTelemetryEvent): void {
  try {
    window.dispatchEvent(new CustomEvent('woof:auth-telemetry', { detail }));
  } catch {
    /* non-browser */
  }
}

export function emitAuthTelemetry(
  normalized: NormalizedAuthFailure,
  endpoint: string,
): void {
  const payload: AuthTelemetryEvent = {
    event: 'auth_failure',
    endpoint,
    kind: normalized.kind,
    httpStatus: normalized.httpStatus,
    requestId: normalized.requestId,
    detail: normalized.serverMessage,
  };

  if (import.meta.env.DEV) {
    console.warn('[woof-auth-telemetry]', payload);
  }

  safeDispatch(payload);

  const hook = (window as unknown as { __WOOF_REPORT_AUTH__?: (p: AuthTelemetryEvent) => void })
    .__WOOF_REPORT_AUTH__;
  if (typeof hook === 'function') {
    try {
      hook(payload);
    } catch {
      /* ignore */
    }
  }
}
