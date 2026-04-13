import { PlaySessionStatus } from '../enums/play-session-status.enum';
import { ParticipantStatus } from '../enums/participant-status.enum';

export interface PlaySession {
  id: string;
  creatorId: string;
  locationText: string;
  date: string;
  startTime: string;
  endTime: string | null;
  comment: string | null;
  inviteCode: string;
  status: PlaySessionStatus;
  maxPlayers: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaySessionParticipant {
  id: string;
  playSessionId: string;
  playerId: string;
  status: ParticipantStatus;
  createdAt: string;
}

export interface PlaySessionDetailed extends PlaySession {
  inviteLink: string;
  participants: {
    id: string;
    firstName: string;
    photoUrl: string | null;
    status: ParticipantStatus;
  }[];
}
