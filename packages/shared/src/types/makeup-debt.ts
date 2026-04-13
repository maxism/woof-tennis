import { MakeupStatus } from '../enums/makeup-status.enum';
import { UserPublic } from './user';

export interface MakeupDebt {
  id: string;
  coachId: string;
  playerId: string;
  originalBookingId: string;
  makeupBookingId: string | null;
  reason: string | null;
  status: MakeupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MakeupDebtDetailed extends MakeupDebt {
  coach: UserPublic;
  player: UserPublic;
}
