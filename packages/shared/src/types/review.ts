import { UserPublic } from './user';

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  targetId: string;
  poopRating: number;
  starRating: number;
  recommendation: string | null;
  comment: string | null;
  createdAt: string;
}

export interface ReviewDetailed extends Review {
  reviewer: UserPublic;
  target: UserPublic;
}
