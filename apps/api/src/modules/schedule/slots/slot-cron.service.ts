import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BookingStatus, SlotStatus, PlaySessionStatus } from '@wooftennis/shared';
import { SlotGeneratorService } from './slot-generator.service';
import { SlotEntity } from './entities/slot.entity';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '@wooftennis/shared';

@Injectable()
export class SlotCronService {
  private readonly logger = new Logger(SlotCronService.name);

  constructor(
    private readonly slotGenerator: SlotGeneratorService,
    @InjectRepository(SlotEntity)
    private readonly slotRepo: Repository<SlotEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async autoGenerateSlots() {
    this.logger.log('Starting auto slot generation...');

    const coaches = await this.slotRepo.manager
      .createQueryBuilder()
      .select('DISTINCT u.id', 'id')
      .from('users', 'u')
      .innerJoin('schedule_templates', 'st', 'st."coachId" = u.id')
      .where('u."isCoach" = true AND st."isActive" = true')
      .getRawMany();

    const dateFrom = new Date();
    const dateTo = new Date();
    dateTo.setDate(dateTo.getDate() + 14);

    let totalGenerated = 0;
    for (const coach of coaches) {
      const result = await this.slotGenerator.generateForCoach(
        coach.id,
        dateFrom,
        dateTo,
      );
      totalGenerated += result.generated;
    }

    this.logger.log(
      `Auto generated ${totalGenerated} slots for ${coaches.length} coaches`,
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendReminders() {
    this.logger.log('Checking for upcoming trainings to remind...');

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const dateStr = now.toISOString().split('T')[0];
    const timeFrom = `${String(twoHoursLater.getHours()).padStart(2, '0')}:${String(twoHoursLater.getMinutes()).padStart(2, '0')}`;
    const timeTo = `${String(threeHoursLater.getHours()).padStart(2, '0')}:${String(threeHoursLater.getMinutes()).padStart(2, '0')}`;

    const bookings = await this.slotRepo.manager
      .createQueryBuilder()
      .select('b.id', 'bookingId')
      .addSelect('b."playerId"', 'playerId')
      .addSelect('s."coachId"', 'coachId')
      .addSelect('s."startTime"', 'startTime')
      .addSelect('l.name', 'locationName')
      .from('bookings', 'b')
      .innerJoin('slots', 's', 's.id = b."slotId"')
      .innerJoin('locations', 'l', 'l.id = s."locationId"')
      .where('b.status = :status', { status: 'confirmed' })
      .andWhere('s.date = :date', { date: dateStr })
      .andWhere('s."startTime" >= :timeFrom AND s."startTime" < :timeTo', {
        timeFrom,
        timeTo,
      })
      .getRawMany();

    for (const b of bookings) {
      await this.notificationsService.send({
        userId: b.playerId,
        type: NotificationType.BookingReminder,
        title: 'Напоминание',
        body: `Тренировка через 2 часа: ${b.startTime}, ${b.locationName}`,
        metadata: { bookingId: b.bookingId },
      });

      await this.notificationsService.send({
        userId: b.coachId,
        type: NotificationType.BookingReminder,
        title: 'Напоминание',
        body: `Тренировка через 2 часа: ${b.startTime}, ${b.locationName}`,
        metadata: { bookingId: b.bookingId },
      });
    }

    this.logger.log(`Sent reminders for ${bookings.length} bookings`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async completeExpiredBookings() {
    this.logger.log('Completing expired bookings...');

    const today = new Date().toISOString().split('T')[0];

    const result = await this.slotRepo.manager
      .createQueryBuilder()
      .update('bookings')
      .set({ status: BookingStatus.Completed })
      .where(
        `status = :status AND "slotId" IN (
          SELECT id FROM slots WHERE date < :today
        )`,
        { status: BookingStatus.Confirmed, today },
      )
      .execute();

    this.logger.log(`Completed ${result.affected || 0} expired bookings`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanupExpiredSessions() {
    this.logger.log('Cleaning up expired play sessions...');

    const today = new Date().toISOString().split('T')[0];

    const result = await this.slotRepo.manager
      .createQueryBuilder()
      .update('play_sessions')
      .set({ status: PlaySessionStatus.Cancelled })
      .where('status = :status AND date < :today', {
        status: PlaySessionStatus.Open,
        today,
      })
      .execute();

    this.logger.log(`Cancelled ${result.affected || 0} expired play sessions`);
  }
}
