import axios from 'axios';
import { API_V1_BASE } from './baseUrl';
import type { User } from '@wooftennis/shared';

const publicClient = axios.create({
  baseURL: API_V1_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface TelegramAuthResponse {
  accessToken: string;
  user: User;
}

/** Тело `POST /auth/telegram/widget` — те же ключи, что у Login Widget (docs/03-api-spec.md). */
export interface TelegramWidgetAuthPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export async function loginWithTelegram(initData: string): Promise<TelegramAuthResponse> {
  const { data } = await publicClient.post<TelegramAuthResponse>('/auth/telegram', {
    initData,
  });
  return data;
}

export async function loginWithTelegramWidget(
  payload: TelegramWidgetAuthPayload,
): Promise<TelegramAuthResponse> {
  const { data } = await publicClient.post<TelegramAuthResponse>(
    '/auth/telegram/widget',
    payload,
  );
  return data;
}
