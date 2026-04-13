import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaySessionEntity } from './entities/play-session.entity';
import { PlaySessionParticipantEntity } from './entities/play-session-participant.entity';
import { PlaySessionsService } from './play-sessions.service';
import { PlaySessionsController } from './play-sessions.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlaySessionEntity,
      PlaySessionParticipantEntity,
    ]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [PlaySessionsController],
  providers: [PlaySessionsService],
  exports: [PlaySessionsService],
})
export class PlaySessionsModule {}
