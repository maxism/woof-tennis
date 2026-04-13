import { apiClient } from './client';
import type { Location } from '@wooftennis/shared';

export async function fetchMyLocations(): Promise<Location[]> {
  const { data } = await apiClient.get<Location[]>('/locations');
  return data;
}
