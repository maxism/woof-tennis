import { apiClient } from './client';
import type { EventInvitePreview, EventItem } from '@wooftennis/shared';

export async function fetchInviteByCode(code: string): Promise<EventInvitePreview> {
  const { data } = await apiClient.get<EventInvitePreview>(`/invites/${code}`);
  return data;
}

export async function acceptInvite(inviteId: string): Promise<EventItem> {
  const { data } = await apiClient.post<EventItem>(`/invites/${inviteId}/accept`);
  return data;
}

export async function declineInvite(inviteId: string): Promise<EventItem> {
  const { data } = await apiClient.post<EventItem>(`/invites/${inviteId}/decline`);
  return data;
}
