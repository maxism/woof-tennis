import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingStatus, EventStatus, InviteStatus, NotificationType, SlotSource, SlotStatus } from '@wooftennis/shared';
import { Repository } from 'typeorm';
import { generateInviteCode } from '../../common/utils/invite-code.util';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { SlotEntity } from '../schedule/slots/entities/slot.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AttachPlayerDto } from './dto/attach-player.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { EventRoleQuery, QueryMyEventsDto } from './dto/query-my-events.dto';
import { RescheduleEventDto } from './dto/reschedule-event.dto';
import { EventInviteEntity } from './entities/event-invite.entity';
import { eventHttpError } from './events.errors';

type EventDto = {
  id: string;
  coachId: string;
  playerId: string | null;
  locationId: string;
  startsAt: string;
  endsAt: string;
  status: EventStatus;
  inviteId: string | null;
  inviteExpiresAt: string | null;
  source: 'manual' | 'template';
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class EventsFacadeService {
  constructor(
    @InjectRepository(SlotEntity)
    private readonly slotRepo: Repository<SlotEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    @InjectRepository(EventInviteEntity)
    private readonly inviteRepo: Repository<EventInviteEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getMyEvents(user: UserEntity, query: QueryMyEventsDto) {
    if (query.role === EventRoleQuery.Coach && !user.isCoach) {
      throw eventHttpError(HttpStatus.FORBIDDEN, 'Требуется доступ тренера', 'ROLE_FORBIDDEN', 'Forbidden');
    }

    const qb = this.slotRepo
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.location', 'location')
      .where('slot.date >= :dateFrom AND slot.date <= :dateTo', {
        dateFrom: this.toDatePart(query.dateFrom),
        dateTo: this.toDatePart(query.dateTo),
      })
      .orderBy('slot.date', 'ASC')
      .addOrderBy('slot.startTime', 'ASC');

    if (query.locationId) {
      qb.andWhere('slot.locationId = :locationId', { locationId: query.locationId });
    }
    if (query.role === EventRoleQuery.Coach) {
      qb.andWhere('slot.coachId = :coachId', { coachId: user.id });
    } else {
      qb.andWhere(
        '(EXISTS(SELECT 1 FROM bookings b WHERE b."slotId" = slot.id AND b."playerId" = :playerId) OR EXISTS(SELECT 1 FROM event_invites i WHERE i."slotId" = slot.id AND i."playerId" = :playerId))',
        { playerId: user.id },
      );
    }

    const slots = await qb.getMany();
    const items = await Promise.all(slots.map((slot) => this.toEventDto(slot)));
    return { items, total: items.length };
  }

  async getEventById(eventId: string, user: UserEntity) {
    const slot = await this.slotRepo.findOne({ where: { id: eventId }, relations: ['location'] });
    if (!slot) {
      throw eventHttpError(HttpStatus.NOT_FOUND, 'Событие не найдено', 'EVENT_NOT_FOUND', 'Not Found');
    }
    const booking = await this.getActiveBooking(slot.id);
    const invite = await this.getLatestInvite(slot.id);
    const hasAccess =
      slot.coachId === user.id ||
      booking?.playerId === user.id ||
      invite?.playerId === user.id;
    if (!hasAccess) {
      throw eventHttpError(HttpStatus.NOT_FOUND, 'Событие не найдено', 'EVENT_NOT_FOUND', 'Not Found');
    }
    return this.toEventDto(slot, booking, invite);
  }

  async createEvent(user: UserEntity, dto: CreateEventDto) {
    this.assertCoachRole(user);
    this.assertValidRange(dto.startsAt, dto.endsAt);
    await this.assertCoachSlotAvailability(user.id, dto.startsAt, dto.endsAt);

    const slot = this.slotRepo.create({
      coachId: user.id,
      locationId: dto.locationId,
      date: this.toDatePart(dto.startsAt),
      startTime: this.toTimePart(dto.startsAt),
      endTime: this.toTimePart(dto.endsAt),
      maxPlayers: 1,
      status: SlotStatus.Available,
      source: SlotSource.Manual,
    });

    const saved = await this.slotRepo.save(slot);
    return this.toEventDto(saved, null, null, EventStatus.Draft);
  }

  async attachPlayer(eventId: string, coach: UserEntity, dto: AttachPlayerDto) {
    this.assertCoachRole(coach);
    const slot = await this.getCoachEventSlot(eventId, coach.id);
    await this.assertSlotCanAcceptPlayer(slot);
    await this.assertPlayerHasNoTimeConflict(dto.playerId, slot, 'EVENT_TIME_CONFLICT');

    const player = await this.userRepo.findOne({ where: { id: dto.playerId } });
    if (!player) {
      throw eventHttpError(HttpStatus.NOT_FOUND, 'Событие не найдено', 'EVENT_NOT_FOUND', 'Not Found');
    }

    let booking = await this.getActiveBooking(slot.id);
    if (booking && booking.playerId !== dto.playerId) {
      throw eventHttpError(HttpStatus.CONFLICT, 'Событие уже занято', 'EVENT_ALREADY_FULL');
    }
    if (!booking) {
      booking = this.bookingRepo.create({
        slotId: slot.id,
        playerId: dto.playerId,
        status: BookingStatus.Confirmed,
      });
      booking = await this.bookingRepo.save(booking);
    }

    slot.status = SlotStatus.Full;
    await this.slotRepo.save(slot);

    await this.notificationsService.send({
      userId: dto.playerId,
      type: NotificationType.BookingCreated,
      title: 'Игрок назначен',
      body: `Тренер назначил вам тренировку ${slot.date} в ${slot.startTime}`,
      metadata: { eventId: slot.id },
    });

    return this.toEventDto(slot, booking, await this.getLatestInvite(slot.id), EventStatus.Attached);
  }

  async createOrReissueInvite(eventId: string, coach: UserEntity) {
    this.assertCoachRole(coach);
    const slot = await this.getCoachEventSlot(eventId, coach.id);
    await this.assertSlotCanAcceptPlayer(slot);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const code = generateInviteCode(10);
    const existing = await this.getLatestInvite(slot.id);
    const invite = existing ?? this.inviteRepo.create({ slotId: slot.id, coachId: coach.id });

    invite.code = code;
    invite.status = InviteStatus.Pending;
    invite.expiresAt = expiresAt;
    invite.playerId = null;
    const saved = await this.inviteRepo.save(invite);

    return {
      inviteId: saved.id,
      code: saved.code,
      expiresAt: saved.expiresAt.toISOString(),
    };
  }

  async getInviteByCode(code: string) {
    const invite = await this.inviteRepo.findOne({ where: { code } });
    if (!invite) {
      throw eventHttpError(HttpStatus.NOT_FOUND, 'Приглашение недействительно', 'INVITE_INVALID', 'Not Found');
    }
    if (invite.status === InviteStatus.Pending && invite.expiresAt.getTime() <= Date.now()) {
      invite.status = InviteStatus.Expired;
      await this.inviteRepo.save(invite);
      throw eventHttpError(HttpStatus.GONE, 'Срок приглашения истек', 'INVITE_EXPIRED');
    }

    const slot = await this.slotRepo.findOne({ where: { id: invite.slotId }, relations: ['location'] });
    if (!slot) {
      throw eventHttpError(HttpStatus.NOT_FOUND, 'Событие не найдено', 'EVENT_NOT_FOUND', 'Not Found');
    }

    return {
      inviteId: invite.id,
      event: await this.toEventDto(slot, await this.getActiveBooking(slot.id), invite),
      status: invite.status,
    };
  }

  async acceptInvite(inviteId: string, user: UserEntity) {
    const invite = await this.getValidInviteForAction(inviteId);
    const slot = await this.mustFindSlot(invite.slotId);
    await this.assertSlotCanAcceptPlayer(slot);
    await this.assertPlayerHasNoTimeConflict(user.id, slot, 'EVENT_TIME_CONFLICT');

    const current = await this.getActiveBooking(slot.id);
    if (current && current.playerId !== user.id) {
      throw eventHttpError(HttpStatus.CONFLICT, 'Событие уже занято', 'EVENT_ALREADY_FULL');
    }

    let booking = current;
    if (!booking) {
      booking = this.bookingRepo.create({
        slotId: slot.id,
        playerId: user.id,
        status: BookingStatus.Confirmed,
      });
      booking = await this.bookingRepo.save(booking);
    }

    invite.status = InviteStatus.Accepted;
    invite.playerId = user.id;
    await this.inviteRepo.save(invite);

    slot.status = SlotStatus.Full;
    await this.slotRepo.save(slot);

    await this.notificationsService.send({
      userId: slot.coachId,
      type: NotificationType.BookingCreated,
      title: 'Игрок принял приглашение',
      body: `Игрок принял приглашение на ${slot.date} в ${slot.startTime}`,
      metadata: { eventId: slot.id, inviteId: invite.id },
    });

    return this.toEventDto(slot, booking, invite, EventStatus.Accepted);
  }

  async declineInvite(inviteId: string, user: UserEntity) {
    const invite = await this.getValidInviteForAction(inviteId);
    invite.status = InviteStatus.Declined;
    invite.playerId = user.id;
    await this.inviteRepo.save(invite);
    const slot = await this.mustFindSlot(invite.slotId);

    await this.notificationsService.send({
      userId: slot.coachId,
      type: NotificationType.BookingCancelled,
      title: 'Приглашение отклонено',
      body: `Игрок отклонил приглашение на ${slot.date} в ${slot.startTime}`,
      metadata: { eventId: slot.id, inviteId: invite.id },
    });

    return this.toEventDto(slot, await this.getActiveBooking(slot.id), invite, EventStatus.Declined);
  }

  async cancelEvent(eventId: string, coach: UserEntity) {
    this.assertCoachRole(coach);
    const slot = await this.getCoachEventSlot(eventId, coach.id);
    slot.status = SlotStatus.Cancelled;
    await this.slotRepo.save(slot);

    const booking = await this.getActiveBooking(slot.id);
    if (booking) {
      booking.status = BookingStatus.Cancelled;
      await this.bookingRepo.save(booking);
      await this.notificationsService.send({
        userId: booking.playerId,
        type: NotificationType.SlotCancelled,
        title: 'Событие отменено',
        body: `Тренировка ${slot.date} в ${slot.startTime} отменена`,
        metadata: { eventId: slot.id },
      });
    }
    return this.toEventDto(slot, booking, await this.getLatestInvite(slot.id), EventStatus.Cancelled);
  }

  async rescheduleEvent(eventId: string, coach: UserEntity, dto: RescheduleEventDto) {
    this.assertCoachRole(coach);
    this.assertValidRange(dto.startsAt, dto.endsAt);
    const slot = await this.getCoachEventSlot(eventId, coach.id);
    await this.assertCoachSlotAvailability(coach.id, dto.startsAt, dto.endsAt, slot.id);

    const booking = await this.getActiveBooking(slot.id);
    if (booking) {
      await this.assertPlayerHasNoTimeConflict(booking.playerId, slot, 'EVENT_TIME_CONFLICT', slot.id, dto.startsAt, dto.endsAt);
    }

    slot.date = this.toDatePart(dto.startsAt);
    slot.startTime = this.toTimePart(dto.startsAt);
    slot.endTime = this.toTimePart(dto.endsAt);
    await this.slotRepo.save(slot);
    return this.toEventDto(slot, booking, await this.getLatestInvite(slot.id), EventStatus.Rescheduled);
  }

  async completeEvent(eventId: string, coach: UserEntity) {
    this.assertCoachRole(coach);
    const slot = await this.getCoachEventSlot(eventId, coach.id);
    const booking = await this.getActiveBooking(slot.id);
    if (booking) {
      booking.status = BookingStatus.Completed;
      await this.bookingRepo.save(booking);
    }
    return this.toEventDto(slot, booking, await this.getLatestInvite(slot.id), EventStatus.Completed);
  }

  private async getValidInviteForAction(inviteId: string) {
    const invite = await this.inviteRepo.findOne({ where: { id: inviteId } });
    if (!invite) {
      throw eventHttpError(HttpStatus.NOT_FOUND, 'Приглашение недействительно', 'INVITE_INVALID', 'Not Found');
    }
    if (invite.status !== InviteStatus.Pending) {
      throw eventHttpError(HttpStatus.CONFLICT, 'Приглашение уже обработано', 'INVITE_ALREADY_RESOLVED');
    }
    if (invite.expiresAt.getTime() <= Date.now()) {
      invite.status = InviteStatus.Expired;
      await this.inviteRepo.save(invite);
      throw eventHttpError(HttpStatus.GONE, 'Срок приглашения истек', 'INVITE_EXPIRED');
    }
    return invite;
  }

  private async assertCoachSlotAvailability(coachId: string, startsAt: Date, endsAt: Date, ignoreSlotId?: string) {
    const date = this.toDatePart(startsAt);
    const start = this.toTimePart(startsAt);
    const end = this.toTimePart(endsAt);

    const qb = this.slotRepo
      .createQueryBuilder('slot')
      .where('slot.coachId = :coachId', { coachId })
      .andWhere('slot.date = :date', { date })
      .andWhere('slot.startTime < :end AND slot.endTime > :start', { start, end });
    if (ignoreSlotId) {
      qb.andWhere('slot.id != :ignoreSlotId', { ignoreSlotId });
    }
    const conflict = await qb.getExists();
    if (conflict) {
      throw eventHttpError(HttpStatus.CONFLICT, 'Это время уже занято', 'EVENT_TIME_CONFLICT', 'Conflict');
    }
  }

  private async assertPlayerHasNoTimeConflict(
    playerId: string,
    slot: SlotEntity,
    code: string,
    ignoreSlotId?: string,
    startsAt?: Date,
    endsAt?: Date,
  ) {
    const date = startsAt ? this.toDatePart(startsAt) : slot.date;
    const start = startsAt ? this.toTimePart(startsAt) : slot.startTime;
    const end = endsAt ? this.toTimePart(endsAt) : slot.endTime;
    const qb = this.bookingRepo
      .createQueryBuilder('booking')
      .innerJoin('booking.slot', 'slot')
      .where('booking.playerId = :playerId', { playerId })
      .andWhere('booking.status = :status', { status: BookingStatus.Confirmed })
      .andWhere('slot.date = :date', { date })
      .andWhere('slot.startTime < :end AND slot.endTime > :start', { start, end });
    if (ignoreSlotId) {
      qb.andWhere('slot.id != :ignoreSlotId', { ignoreSlotId });
    }
    const exists = await qb.getExists();
    if (exists) {
      throw eventHttpError(HttpStatus.CONFLICT, 'Это время уже занято', code, 'Conflict');
    }
  }

  private async getCoachEventSlot(eventId: string, coachId: string) {
    const slot = await this.slotRepo.findOne({ where: { id: eventId }, relations: ['location'] });
    if (!slot) {
      throw eventHttpError(HttpStatus.NOT_FOUND, 'Событие не найдено', 'EVENT_NOT_FOUND', 'Not Found');
    }
    if (slot.coachId !== coachId) {
      throw eventHttpError(HttpStatus.FORBIDDEN, 'Недостаточно прав', 'ROLE_FORBIDDEN', 'Forbidden');
    }
    return slot;
  }

  private async mustFindSlot(slotId: string) {
    const slot = await this.slotRepo.findOne({ where: { id: slotId }, relations: ['location'] });
    if (!slot) {
      throw eventHttpError(HttpStatus.NOT_FOUND, 'Событие не найдено', 'EVENT_NOT_FOUND', 'Not Found');
    }
    return slot;
  }

  private async assertSlotCanAcceptPlayer(slot: SlotEntity) {
    if (slot.status === SlotStatus.Cancelled) {
      throw eventHttpError(HttpStatus.CONFLICT, 'Событие недоступно', 'EVENT_NOT_AVAILABLE', 'Conflict');
    }
    const activeBookingsCount = await this.bookingRepo.count({
      where: { slotId: slot.id, status: BookingStatus.Confirmed },
    });
    if (activeBookingsCount >= slot.maxPlayers) {
      throw eventHttpError(HttpStatus.CONFLICT, 'Событие уже занято', 'EVENT_ALREADY_FULL', 'Conflict');
    }
  }

  private assertCoachRole(user: UserEntity) {
    if (!user.isCoach) {
      throw eventHttpError(HttpStatus.FORBIDDEN, 'Требуется доступ тренера', 'ROLE_FORBIDDEN', 'Forbidden');
    }
  }

  private assertValidRange(startsAt: Date, endsAt: Date) {
    if (startsAt.getTime() >= endsAt.getTime()) {
      throw eventHttpError(HttpStatus.BAD_REQUEST, 'Время окончания должно быть позже начала', 'EVENT_NOT_AVAILABLE', 'Validation Error');
    }
  }

  private async toEventDto(
    slot: SlotEntity,
    booking?: BookingEntity | null,
    invite?: EventInviteEntity | null,
    forcedStatus?: EventStatus,
  ): Promise<EventDto> {
    const resolvedBooking = booking ?? (await this.getActiveBooking(slot.id));
    const resolvedInvite = invite ?? (await this.getLatestInvite(slot.id));
    return {
      id: slot.id,
      coachId: slot.coachId,
      playerId: resolvedBooking?.playerId ?? resolvedInvite?.playerId ?? null,
      locationId: slot.locationId,
      startsAt: this.toIsoDateTime(slot.date, slot.startTime),
      endsAt: this.toIsoDateTime(slot.date, slot.endTime),
      status: forcedStatus ?? this.resolveStatus(slot, resolvedBooking, resolvedInvite),
      inviteId: resolvedInvite?.id ?? null,
      inviteExpiresAt: resolvedInvite?.expiresAt?.toISOString() ?? null,
      source: slot.source as 'manual' | 'template',
      createdAt: slot.createdAt.toISOString(),
      updatedAt: slot.updatedAt.toISOString(),
    };
  }

  private resolveStatus(slot: SlotEntity, booking?: BookingEntity | null, invite?: EventInviteEntity | null): EventStatus {
    if (slot.status === SlotStatus.Cancelled) return EventStatus.Cancelled;
    if (booking?.status === BookingStatus.Completed) return EventStatus.Completed;
    if (booking?.status === BookingStatus.Confirmed) {
      return invite?.status === InviteStatus.Accepted ? EventStatus.Accepted : EventStatus.Attached;
    }
    if (invite?.status === InviteStatus.Declined) return EventStatus.Declined;
    if (invite?.status === InviteStatus.Pending) return EventStatus.Invited;
    return EventStatus.Draft;
  }

  private async getActiveBooking(slotId: string) {
    return this.bookingRepo.findOne({
      where: [{ slotId, status: BookingStatus.Confirmed }, { slotId, status: BookingStatus.Completed }],
      order: { createdAt: 'DESC' },
    });
  }

  private async getLatestInvite(slotId: string) {
    return this.inviteRepo.findOne({
      where: { slotId },
      order: { updatedAt: 'DESC' },
    });
  }

  private toDatePart(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private toTimePart(date: Date) {
    return date.toISOString().split('T')[1].slice(0, 8);
  }

  private toIsoDateTime(date: string, time: string) {
    return `${date}T${time}Z`;
  }
}
