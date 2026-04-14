import { apiClient } from './client';
import type { Location } from '@wooftennis/shared';
import { buildSafeQuery } from './safeQuery';

export interface CreateLocationBody {
  name: string;
  address: string;
  description: string;
  website: string;
}

const LOCATION_QUERY_KEYS = ['isActive'] as const;

export async function fetchMyLocations(params?: { isActive?: boolean }): Promise<Location[]> {
  const query = buildSafeQuery(
    params as Record<string, string | number | boolean | undefined>,
    LOCATION_QUERY_KEYS,
  );
  const { data } = await apiClient.get<Location[]>('/locations', { params: query });
  return data;
}

export async function createLocation(body: CreateLocationBody): Promise<Location> {
  const { data } = await apiClient.post<Location>('/locations', body);
  return data;
}
