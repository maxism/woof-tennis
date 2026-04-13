import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatus, SlotStatus } from '@wooftennis/shared';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { SlotsService } from '../schedule/slots/slots.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@wooftennis/shared';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    private readonly slotsService: SlotsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findMyBookings(playerId: string, query: QueryBookingsDto) {
    const qb = this.bookingRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.slot', 'slot')
      .leftJoinAndSelect('slot.location', 'location')
      .leftJoinAndSelect('slot.coach', 'coach')
      .where('b.playerId = :playerId', { playerId });

    if (query.status) {
      qb.andWhere('b.status = :status', { status: query.status });
    }
    if (query.dateFrom) {
      qb.andWhere('slot.date >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('slot.date <= :dateTo', { dateTo: query.dateTo });
    }

    qb.orderBy('slot.date', 'DESC').addOrderBy('slot.startTime', 'DESC');

    const [items, total] = await qb
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();

    return new PaginatedResponseDto(items, total, query.page, query.limit);
  }

  async findCoachBookings(coachId: string, query: QueryBookingsDto) {
    const qb = this.bookingRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.slot', 'slot')
      .leftJoinAndSelect('slot.location', 'location')
      .leftJoinAndSelect('b.player', 'player')
      .where('slot.coachId = :coachId', { coachId });

    if (query.status) {
      qb.andWhere('b.status = :status', { status: query.status });
    }
    if (query.dateFrom) {
      qb.andWhere('slot.date >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('slot.date <= :dateTo', { dateTo: query.dateTo });
    }

    qb.orderBy('slot.date', 'DESC').addOrderBy('slot.startTime', 'DESC');

    const [items, total] = await qb
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();

    return new PaginatedResponseDto(items, total, query.page, query.limit);
  }

  async create(playerId: string, dto: CreateBookingDto): Promise<BookingEntity> {
    const slot = await this.slotsService.findById(dto.slotId);
    if (!slot) throw new NotFoundException('Слот не найден');

    if (
      slot.status !== SlotStatus.Available &&
      slot.status !== SlotStatus.Booked
    ) {
      throw new BadRequestException('Слот недоступен для бронирования');
    }

    const today = new Date().toISOString().split('T')[0];
    if (slot.date < today) {
      throw new BadRequestException('Нельзя забронировать слот в прошлом');
    }

    const existingBooking = await this.bookingRepo.findOne({
      where: { slotId: slot.id, playerId },
    });
    if (existingBooking) {
      throw new ConflictException('Вы уже забронировали этот слот');
    }

    const activeBookingsCount = await this.bookingRepo.count({
      where: { slotId: slot.id, status: BookingStatus.Confirmed },
    });
    if (activeBookingsCount >= slot.maxPlayers) {
      throw new BadRequestException('Все места в слоте заняты');
    }

    const booking = this.bookingRepo.create({
      slotId: slot.id,
      playerId,
      status: BookingStatus.Confirmed,
    });
    const saved = await this.bookingRepo.save(booking);

    await this.slotsService.recalculateSlotStatus(slot.id);

    await this.notificationsService.send({
      userId: slot.coachId,
      type: NotificationType.BookingCreated,
      title: 'Новое бронирование',
      body: `Новое бронирование на ${slot.date} в ${slot.startTime}`,
      metadata: { bookingId: saved.id, slotId: slot.id },
    });

    return saved;
  }

  async cancel(
    bookingId: string,
    userId: string,
    isCoach: boolean,
  ): Promise<BookingEntity> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['slot', 'slot.coach'],
    });
    if (!booking) throw new NotFoundException('Бронирование не найдено');

    const isOwner = booking.playerId === userId;
    const isSlotCoach = booking.slot.coachId === userId;

    if (!isOwner && !isSlotCoach) {
      throw new ForbiddenException('Нет доступа к этому бронированию');
    }

    if (booking.status !== BookingStatus.Confirmed) {
      throw new BadRequestException('Бронирование нельзя отменить');
    }

    if (isOwner && !isCoach) {
      const slotDateTime = new Date(
        `${booking.slot.date}T${booking.slot.startTime}`,
      );
      const hoursUntil =
        (slotDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntil < 24) {
        throw new BadRequestException(
          'Нельзя отменить бронирование менее чем за 24 часа до тренировки',
        );
      }
    }

    booking.status = BookingStatus.Cancelled;
    const saved = await this.bookingRepo.save(booking);

    await this.slotsService.recalculateSlotStatus(booking.slotId);

    const notifyUserId = isOwner ? booking.slot.coachId : booking.playerId;
    await this.notificationsService.send({
      userId: notifyUserId,
      type: NotificationType.BookingCancelled,
      title: 'Отмена тренировки',
      body: `Тренировка на ${booking.slot.date} в ${booking.slot.startTime} отменена`,
      metadata: { bookingId: booking.id },
    });

    return saved;
  }

  async openSplit(bookingId: string, userId: string): Promise<BookingEntity> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['slot'],
    });
    if (!booking) throw new NotFoundException('Бронирование не найдено');
    if (booking.playerId !== userId) {
      throw new ForbiddenException('Нет доступа к этому бронированию');
    }
    if (booking.status !== BookingStatus.Confirmed) {
      throw new BadRequestException('Бронирование не активно');
    }
    if (booking.slot.maxPlayers <= 1) {
      throw new BadRequestException(
        'Слот не поддерживает сплит-тренировки',
      );
    }

    booking.isSplitOpen = true;
    return this.bookingRepo.save(booking);
  }

  async closeSplit(bookingId: string, userId: string): Promise<BookingEntity> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Бронирование не найдено');
    if (booking.playerId !== userId)
      throw new ForbiddenException('Нет доступа к этому бронированию');

    booking.isSplitOpen = false;
    return this.bookingRepo.save(booking);
  }

  async complete(bookingId: string, coachId: string): Promise<BookingEntity> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['slot'],
    });
    if (!booking) throw new NotFoundException('Бронирование не найдено');
    if (booking.slot.coachId !== coachId) {
      throw new ForbiddenException('Нет доступа к этому бронированию');
    }
    if (booking.status !== BookingStatus.Confirmed) {
      throw new BadRequestException('Бронирование не активно');
    }

    booking.status = BookingStatus.Completed;
    const saved = await this.bookingRepo.save(booking);

    await this.notificationsService.send({
      userId: booking.playerId,
      type: NotificationType.BookingCompleted,
      title: 'Тренировка завершена',
      body: 'Тренировка завершена! Оцените тренера',
      metadata: { bookingId: booking.id },
    });

    return saved;
  }

  async noShow(bookingId: string, coachId: string): Promise<BookingEntity> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['slot'],
    });
    if (!booking) throw new NotFoundException('Бронирование не найдено');
    if (booking.slot.coachId !== coachId) {
      throw new ForbiddenException('Нет доступа к этому бронированию');
    }

    booking.status = BookingStatus.NoShow;
    return this.bookingRepo.save(booking);
  }

  async findById(id: string): Promise<BookingEntity | null> {
    return this.bookingRepo.findOne({
      where: { id },
      relations: ['slot', 'player'],
    });
  }
}
