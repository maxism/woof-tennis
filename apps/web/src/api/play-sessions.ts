import { apiClient } from './client';
import type { PlaySession, PlaySessionDetailed } from '@wooftennis/shared';
import type { PaginatedResponse } from '@wooftennis/shared';

export interface CreatePlaySessionBody {
  locationText: string;
  date: string;
  startTime: string;
  endTime?: string;
  comment?: string;
  maxPlayers: number;
}

export async function createPlaySession(body: CreatePlaySessionBody): Promise<PlaySession> {
  const { data } = await apiClient.post<PlaySession>('/play-sessions', body);
  return data;
}

export async function fetchPlaySessionByInvite(
  inviteCode: string,
): Promise<PlaySessionDetailed> {
  const { data } = await apiClient.get<PlaySessionDetailed>(
    `/play-sessions/by-invite/${inviteCode}`,
  );
  return data;
}

export async function joinPlaySession(id: string): Promise<PlaySession> {
  const { data } = await apiClient.post<PlaySession>(`/play-sessions/${id}/join`);
  return data;
}

export async function fetchMyPlaySessions(
  params?: { page?: number; limit?: number },
): Promise<PaginatedResponse<PlaySession>> {
  const { data } = await apiClient.get<PaginatedResponse<PlaySession>>(
    '/play-sessions/my',
    { params },
  );
  return data;
}
