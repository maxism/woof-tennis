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
