import { apiClient } from './client';
import type { Notification } from '@wooftennis/shared';
import type { PaginatedResponse } from '@wooftennis/shared';

export async function fetchNotifications(params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}): Promise<PaginatedResponse<Notification>> {
  const { data } = await apiClient.get<PaginatedResponse<Notification>>(
    '/notifications',
    { params },
  );
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post('/notifications/read-all');
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  const { data } = await apiClient.get<{ items: unknown[]; total: number }>(
    '/notifications',
    { params: { isRead: false, limit: 1, page: 1 } },
  );
  return data.total;
}
