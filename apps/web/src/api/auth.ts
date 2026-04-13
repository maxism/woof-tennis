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

export async function loginWithTelegram(initData: string): Promise<TelegramAuthResponse> {
  const { data } = await publicClient.post<TelegramAuthResponse>('/auth/telegram', {
    initData,
  });
  return data;
}
