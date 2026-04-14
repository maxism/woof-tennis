import { apiClient } from './client';
import type { EventInviteResponse, EventItem, EventListResponse } from '@wooftennis/shared';

export interface FetchMyEventsParams {
  role: 'player' | 'coach';
  dateFrom: string;
  dateTo: string;
  locationId?: string;
}

export interface CreateEventBody {
  locationId: string;
  startsAt: string;
  endsAt: string;
  recurrence: null;
  isRecurring?: boolean;
}

export interface CreateInviteBody {
  targets: string[];
}

export async function fetchMyEvents(params: FetchMyEventsParams): Promise<EventListResponse> {
  const { data } = await apiClient.get<EventListResponse>('/events/my', { params });
  return data;
}

export async function fetchEventById(eventId: string): Promise<EventItem> {
  const { data } = await apiClient.get<EventItem>(`/events/${eventId}`);
  return data;
}

export async function createEvent(body: CreateEventBody): Promise<EventItem> {
  const { data } = await apiClient.post<EventItem>('/events', body);
  return data;
}

export async function attachPlayer(eventId: string, playerId: string): Promise<EventItem> {
  const { data } = await apiClient.post<EventItem>(`/events/${eventId}/attach-player`, { playerId });
  return data;
}

export async function createInvite(eventId: string, body: CreateInviteBody): Promise<EventInviteResponse> {
  const { data } = await apiClient.post<EventInviteResponse>(`/events/${eventId}/invite`, body);
  return data;
}
