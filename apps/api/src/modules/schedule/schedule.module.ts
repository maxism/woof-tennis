import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleTemplateEntity } from './templates/entities/schedule-template.entity';
import { SlotEntity } from './slots/entities/slot.entity';
import { TemplatesService } from './templates/templates.service';
import { TemplatesController } from './templates/templates.controller';
import { SlotsService } from './slots/slots.service';
import { SlotsController } from './slots/slots.controller';
import { SlotGeneratorService } from './slots/slot-generator.service';
import { SlotCronService } from './slots/slot-cron.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleTemplateEntity, SlotEntity]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [TemplatesController, SlotsController],
  providers: [
    TemplatesService,
    SlotsService,
    SlotGeneratorService,
    SlotCronService,
  ],
  exports: [TemplatesService, SlotsService, SlotGeneratorService],
})
export class ScheduleTemplatesModule {}
