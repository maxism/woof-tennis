import { apiClient } from './client';
import type { BookingDetailed, BookingStatus } from '@wooftennis/shared';
import type { PaginatedResponse } from '@wooftennis/shared';

export interface QueryBookingsParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchMyBookings(
  params?: QueryBookingsParams,
): Promise<PaginatedResponse<BookingDetailed>> {
  const { data } = await apiClient.get<PaginatedResponse<BookingDetailed>>(
    '/bookings/my',
    { params },
  );
  return data;
}

export async function fetchCoachBookings(
  params?: QueryBookingsParams,
): Promise<PaginatedResponse<BookingDetailed>> {
  const { data } = await apiClient.get<PaginatedResponse<BookingDetailed>>(
    '/bookings/coach',
    { params },
  );
  return data;
}

export async function createBooking(slotId: string): Promise<BookingDetailed> {
  const { data } = await apiClient.post<BookingDetailed>('/bookings', { slotId });
  return data;
}

export async function cancelBooking(id: string, reason?: string): Promise<BookingDetailed> {
  const { data } = await apiClient.patch<BookingDetailed>(`/bookings/${id}/cancel`, {
    reason,
  });
  return data;
}
