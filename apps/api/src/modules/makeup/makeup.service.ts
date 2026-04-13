import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MakeupStatus,
  BookingStatus,
  NotificationType,
} from '@wooftennis/shared';
import { MakeupDebtEntity } from './entities/makeup-debt.entity';
import { CreateMakeupDebtDto } from './dto/create-makeup-debt.dto';
import { ResolveMakeupDebtDto } from './dto/resolve-makeup-debt.dto';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MakeupService {
  constructor(
    @InjectRepository(MakeupDebtEntity)
    private readonly makeupRepo: Repository<MakeupDebtEntity>,
    private readonly bookingsService: BookingsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    coachId: string,
    dto: CreateMakeupDebtDto,
  ): Promise<MakeupDebtEntity> {
    const booking = await this.bookingsService.findById(
      dto.originalBookingId,
    );
    if (!booking) throw new NotFoundException('Бронирование не найдено');

    if (booking.slot.coachId !== coachId) {
      throw new ForbiddenException(
        'Бронирование не принадлежит вашему слоту',
      );
    }

    if (
      booking.status !== BookingStatus.NoShow &&
      booking.status !== BookingStatus.Cancelled
    ) {
      throw new BadRequestException(
        'Отыгрыш можно назначить только для пропущенной или отменённой тренировки',
      );
    }

    const debt = this.makeupRepo.create({
      coachId,
      playerId: dto.playerId,
      originalBookingId: dto.originalBookingId,
      reason: dto.reason || null,
      status: MakeupStatus.Pending,
    });

    const saved = await this.makeupRepo.save(debt);

    await this.notificationsService.send({
      userId: dto.playerId,
      type: NotificationType.MakeupAssigned,
      title: 'Назначен отыгрыш',
      body: `Тренер назначил отыгрыш${dto.reason ? `: ${dto.reason}` : ''}`,
      metadata: { makeupDebtId: saved.id },
    });

    return saved;
  }

  async findAll(
    userId: string,
    role: 'coach' | 'player',
    playerId?: string,
    status?: string,
  ): Promise<MakeupDebtEntity[]> {
    const qb = this.makeupRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.coach', 'coach')
      .leftJoinAndSelect('m.player', 'player');

    if (role === 'coach') {
      qb.where('m.coachId = :userId', { userId });
      if (playerId) {
        qb.andWhere('m.playerId = :playerId', { playerId });
      }
    } else {
      qb.where('m.playerId = :userId', { userId });
    }

    if (status) {
      qb.andWhere('m.status = :status', { status });
    }

    return qb.orderBy('m.createdAt', 'DESC').getMany();
  }

  async resolve(
    id: string,
    coachId: string,
    dto: ResolveMakeupDebtDto,
  ): Promise<MakeupDebtEntity> {
    const debt = await this.makeupRepo.findOne({ where: { id } });
    if (!debt) throw new NotFoundException('Отыгрыш не найден');
    if (debt.coachId !== coachId)
      throw new ForbiddenException('Нет доступа к этому отыгрышу');
    if (debt.status !== MakeupStatus.Pending)
      throw new BadRequestException('Отыгрыш уже обработан');

    debt.makeupBookingId = dto.makeupBookingId;
    debt.status = MakeupStatus.Resolved;
    const saved = await this.makeupRepo.save(debt);

    await this.notificationsService.send({
      userId: debt.playerId,
      type: NotificationType.MakeupResolved,
      title: 'Отыгрыш закрыт',
      body: 'Ваш отыгрыш закрыт',
      metadata: { makeupDebtId: debt.id },
    });

    return saved;
  }

  async cancel(id: string, coachId: string): Promise<MakeupDebtEntity> {
    const debt = await this.makeupRepo.findOne({ where: { id } });
    if (!debt) throw new NotFoundException('Отыгрыш не найден');
    if (debt.coachId !== coachId)
      throw new ForbiddenException('Нет доступа к этому отыгрышу');

    debt.status = MakeupStatus.Cancelled;
    return this.makeupRepo.save(debt);
  }
}
