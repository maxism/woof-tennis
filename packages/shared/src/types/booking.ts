import { BookingStatus } from '../enums/booking-status.enum';
import { SlotWithLocation } from './slot';
import { UserPublic } from './user';

export interface Booking {
  id: string;
  slotId: string;
  playerId: string;
  status: BookingStatus;
  isSplitOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDetailed extends Booking {
  slot: SlotWithLocation;
  coach: UserPublic;
  splitPartners: UserPublic[];
  review: import('./review').Review | null;
}
