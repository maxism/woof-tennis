import type { EventStatus } from '../enums/event-status.enum';

export interface EventItem {
  id: string;
  coachId: string;
  playerId: string | null;
  locationId: string;
  locationName?: string;
  startsAt: string;
  endsAt: string;
  isRecurring: boolean;
  status: EventStatus;
  inviteId: string | null;
  inviteCode: string | null;
  inviteExpiresAt: string | null;
  source: 'manual' | 'template';
  createdAt: string;
  updatedAt: string;
}

export type EventRuntime = EventItem;

export interface EventListResponse {
  items: EventItem[];
  total: number;
}

export interface EventInvitePreview {
  inviteId: string;
  event: EventItem;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface EventInviteResponse {
  inviteId: string;
  code: string;
  expiresAt: string;
}
