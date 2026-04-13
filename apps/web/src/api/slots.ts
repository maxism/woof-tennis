import { apiClient } from './client';
import type { SlotPublic, SlotStatus } from '@wooftennis/shared';

export interface QuerySlotsParams {
  coachId: string;
  locationId?: string;
  dateFrom: string;
  dateTo: string;
  status?: SlotStatus;
}

export async function fetchSlots(params: QuerySlotsParams): Promise<SlotPublic[]> {
  const { data } = await apiClient.get<SlotPublic[]>('/slots', { params });
  return data;
}
