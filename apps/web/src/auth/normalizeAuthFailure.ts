import axios, { type AxiosError } from 'axios';
import type { AuthFailureKind } from './authFailureKind';

export interface NormalizedAuthFailure {
  kind: AuthFailureKind;
  httpStatus?: number;
  /** См. payload API (`requestId`) или заголовок `X-Request-Id`, если есть. */
  requestId?: string;
  /** Сырой текст от сервера (для dev / телеметрии), не для прямого показа пользователю. */
  serverMessage?: string;
}

function extractRequestId(error: AxiosError): string | undefined {
  const data = error.response?.data;
  if (data && typeof data === 'object' && 'requestId' in data) {
    const id = (data as { requestId?: unknown }).requestId;
    if (typeof id === 'string' && id.trim()) return id;
  }
  const h = error.response?.headers;
  if (!h) return undefined;
  const v = h['x-request-id'] ?? h['X-Request-Id'];
  return typeof v === 'string' ? v : undefined;
}

function extractServerMessage(error: AxiosError): string | undefined {
  const data = error.response?.data;
  if (!data || typeof data !== 'object') return undefined;
  const m = (data as { message?: unknown }).message;
  if (typeof m === 'string') return m;
  if (Array.isArray(m)) return m.map(String).join(', ');
  return undefined;
}

/**
 * Нормализует сетевую/HTTP ошибку в инфраструктурный класс для UI и телеметрии.
 * Не содержит финальных пользовательских текстов (см. mapAuthFailureToUserMessage).
 */
export function normalizeAuthFailure(
  error: unknown,
  _endpoint: string,
): NormalizedAuthFailure {
  if (axios.isAxiosError(error)) {
    const requestId = extractRequestId(error);
    const serverMessage = extractServerMessage(error);

    if (error.response == null) {
      const code = error.code;
      if (code === 'ERR_NETWORK' || code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
        return { kind: 'network', requestId, serverMessage: serverMessage ?? error.message };
      }
      return { kind: 'network', requestId, serverMessage: serverMessage ?? error.message };
    }

    const status = error.response.status;

    if (status === 401) {
      return { kind: 'unauthorized', httpStatus: 401, requestId, serverMessage };
    }
    if (status === 429) {
      return { kind: 'rate_limited', httpStatus: 429, requestId, serverMessage };
    }
    if (status >= 500) {
      return { kind: 'server_error', httpStatus: status, requestId, serverMessage };
    }
    if (status === 400 || status === 422) {
      return { kind: 'client_error', httpStatus: status, requestId, serverMessage };
    }
    return { kind: 'unknown', httpStatus: status, requestId, serverMessage };
  }

  if (error instanceof Error) {
    return { kind: 'unknown', serverMessage: error.message };
  }

  return { kind: 'unknown', serverMessage: String(error) };
}
