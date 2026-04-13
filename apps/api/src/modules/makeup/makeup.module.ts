import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakeupDebtEntity } from './entities/makeup-debt.entity';
import { MakeupService } from './makeup.service';
import { MakeupController } from './makeup.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MakeupDebtEntity]),
    forwardRef(() => BookingsModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [MakeupController],
  providers: [MakeupService],
  exports: [MakeupService],
})
export class MakeupModule {}
