import { NotificationType } from '../enums/notification-type.enum';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  metadata: Record<string, any> | null;
  createdAt: string;
}
