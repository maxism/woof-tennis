import { apiClient } from './client';
import type { Review } from '@wooftennis/shared';

export interface CreateReviewBody {
  bookingId: string;
  targetId: string;
  ratingValue: number;
  ratingStyle: 'poop' | 'star';
  recommendation?: string;
  comment?: string;
}

export async function createReview(body: CreateReviewBody): Promise<Review> {
  const { data } = await apiClient.post<Review>('/reviews', body);
  return data;
}
