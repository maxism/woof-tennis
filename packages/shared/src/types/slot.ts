import { SlotStatus } from '../enums/slot-status.enum';
import { SlotSource } from '../enums/slot-source.enum';

export interface Slot {
  id: string;
  coachId: string;
  locationId: string;
  templateId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  status: SlotStatus;
  source: SlotSource;
  createdAt: string;
  updatedAt: string;
}

export interface SlotWithLocation extends Slot {
  location: { id: string; name: string; address: string };
}

export interface SlotPublic extends SlotWithLocation {
  currentBookings: number;
  hasSplitOpen: boolean;
}
