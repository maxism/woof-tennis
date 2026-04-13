import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TelegramNotifierService } from './telegram-notifier.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    forwardRef(() => BotModule),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, TelegramNotifierService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
