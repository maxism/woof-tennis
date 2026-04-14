import { InviteStatus } from '../enums/invite-status.enum';
import { EventRuntime } from './event';

export interface InvitePreview {
  inviteId: string;
  event: EventRuntime;
  status: InviteStatus;
}
