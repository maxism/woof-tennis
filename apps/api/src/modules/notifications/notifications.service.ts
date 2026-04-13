import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType } from '@wooftennis/shared';
import { NotificationEntity } from './entities/notification.entity';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { TelegramNotifierService } from './telegram-notifier.service';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    private readonly telegramNotifier: TelegramNotifierService,
  ) {}

  async send(payload: NotificationPayload): Promise<void> {
    await this.notificationRepo.save({
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      metadata: payload.metadata || null,
      isRead: false,
    });

    const user = await this.notificationRepo.manager
      .createQueryBuilder()
      .select('u."telegramId"')
      .from('users', 'u')
      .where('u.id = :userId', { userId: payload.userId })
      .getRawOne();

    if (user?.telegramId) {
      await this.telegramNotifier.sendNotification(
        Number(user.telegramId),
        payload.title,
        payload.body,
      );
    }
  }

  async findUserNotifications(userId: string, query: QueryNotificationsDto) {
    const qb = this.notificationRepo
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId });

    if (query.isRead !== undefined) {
      qb.andWhere('n.isRead = :isRead', { isRead: query.isRead });
    }

    qb.orderBy('n.createdAt', 'DESC');

    const [items, total] = await qb
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();

    const unreadCount = await this.notificationRepo.count({
      where: { userId, isRead: false },
    });

    return {
      ...new PaginatedResponseDto(items, total, query.page, query.limit),
      unreadCount,
    };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });
    if (!notification) throw new NotFoundException('Уведомление не найдено');

    notification.isRead = true;
    await this.notificationRepo.save(notification);
    return { id: notification.id, isRead: true };
  }

  async markAllAsRead(userId: string) {
    const result = await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true },
    );
    return { updated: result.affected || 0 };
  }
}
