import { apiClient } from './client';
import type { Location } from '@wooftennis/shared';

export interface CreateLocationBody {
  name: string;
  address: string;
}

export async function fetchMyLocations(): Promise<Location[]> {
  const { data } = await apiClient.get<Location[]>('/locations');
  return data;
}

export async function createLocation(body: CreateLocationBody): Promise<Location> {
  const { data } = await apiClient.post<Location>('/locations', body);
  return data;
}
