import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { SlotEntity } from '../schedule/slots/entities/slot.entity';
import { UserEntity } from '../users/entities/user.entity';
import { EventsController } from './events.controller';
import { EventsFacadeService } from './events-facade.service';
import { EventInviteEntity } from './entities/event-invite.entity';
import { InvitesController } from './invites.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SlotEntity, BookingEntity, EventInviteEntity, UserEntity]),
    NotificationsModule,
  ],
  controllers: [EventsController, InvitesController],
  providers: [EventsFacadeService],
  exports: [EventsFacadeService],
})
export class EventsModule {}
