import axios from 'axios';

export function getApiErrorMessage(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e) && e.response?.data && typeof e.response.data === 'object') {
    const m = (e.response.data as { message?: unknown }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.map(String).join(', ');
  }
  if (e instanceof Error) return e.message;
  return fallback;
}
