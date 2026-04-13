export interface User {
  id: string;
  telegramId: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  isCoach: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPublic {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  isCoach: boolean;
}

export interface UserStats {
  totalBookingsAsPlayer: number;
  totalBookingsAsCoach: number;
  avgRatingAsPlayer: number | null;
  avgRatingAsCoach: number | null;
  pendingMakeupDebts: number;
}

export interface UserWithStats extends User {
  stats: UserStats;
}

export interface CoachPublicProfile extends UserPublic {
  locations: { id: string; name: string; address: string; photoUrl: string | null }[];
  stats: {
    totalStudents: number;
    avgRating: number | null;
    totalReviews: number;
  };
}
