import axios from 'axios';
import { apiClient } from './client';
import { API_V1_BASE } from './baseUrl';
import type { CoachPublicProfile, User, UserWithStats } from '@wooftennis/shared';

export async function fetchMeWithToken(token: string): Promise<UserWithStats> {
  const { data } = await axios.get<UserWithStats>(`${API_V1_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function fetchMe(): Promise<UserWithStats> {
  const { data } = await apiClient.get<UserWithStats>('/users/me');
  return data;
}

export async function updateMe(body: { isCoach?: boolean }): Promise<User> {
  const { data } = await apiClient.patch<User>('/users/me', body);
  return data;
}

export async function fetchCoachPublic(id: string): Promise<CoachPublicProfile> {
  const { data } = await apiClient.get<CoachPublicProfile>(`/users/${id}/public`);
  return data;
}
