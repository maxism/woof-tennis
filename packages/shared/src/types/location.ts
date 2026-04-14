export interface Location {
  id: string;
  coachId: string;
  name: string;
  address: string;
  description: string | null;
  website: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
