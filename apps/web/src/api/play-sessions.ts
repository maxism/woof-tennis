import { apiClient } from './client';
import type { PlaySession, PlaySessionDetailed } from '@wooftennis/shared';
import type { PaginatedResponse } from '@wooftennis/shared';
import { buildSafeQuery } from './safeQuery';

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
  params?: { dateFrom?: string; dateTo?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<PlaySession>> {
  const paginationEnabled = import.meta.env.VITE_PLAY_SESSIONS_PAGINATION_ENABLED === 'true';
  const allowedKeys = paginationEnabled
    ? (['dateFrom', 'dateTo', 'page', 'limit'] as const)
    : (['dateFrom', 'dateTo'] as const);
  const query = buildSafeQuery(
    params as Record<string, string | number | boolean | undefined>,
    allowedKeys,
  );
  const { data } = await apiClient.get<PaginatedResponse<PlaySession> | PlaySession[]>(
    '/play-sessions/my',
    { params: query },
  );
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: 1,
      limit: data.length || 20,
    };
  }
  return data;
}
