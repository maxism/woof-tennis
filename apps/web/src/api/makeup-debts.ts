import { apiClient } from './client';
import type { MakeupDebt } from '@wooftennis/shared';

export async function fetchMakeupDebts(): Promise<MakeupDebt[]> {
  const { data } = await apiClient.get<MakeupDebt[]>('/makeup-debts');
  return data;
}
