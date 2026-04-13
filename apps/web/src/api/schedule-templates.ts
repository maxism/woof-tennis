import { apiClient } from './client';
import type { ScheduleTemplate } from '@wooftennis/shared';

export async function fetchScheduleTemplates(locationId?: string): Promise<ScheduleTemplate[]> {
  const { data } = await apiClient.get<ScheduleTemplate[]>('/schedule-templates', {
    params: locationId ? { locationId } : undefined,
  });
  return data;
}
