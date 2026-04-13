import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlotStatus, SlotSource } from '@wooftennis/shared';
import { SlotEntity } from './entities/slot.entity';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { QuerySlotsDto } from './dto/query-slots.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(SlotEntity)
    private readonly slotRepo: Repository<SlotEntity>,
  ) {}

  async findSlots(query: QuerySlotsDto) {
    const qb = this.slotRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.location', 'location')
      .where('s.coachId = :coachId', { coachId: query.coachId })
      .andWhere('s.date >= :dateFrom', { dateFrom: query.dateFrom })
      .andWhere('s.date <= :dateTo', { dateTo: query.dateTo });

    if (query.locationId) {
      qb.andWhere('s.locationId = :locationId', {
        locationId: query.locationId,
      });
    }
    if (query.status) {
      qb.andWhere('s.status = :status', { status: query.status });
    }

    qb.orderBy('s.date', 'ASC').addOrderBy('s.startTime', 'ASC');

    const slots = await qb.getMany();

    const result: any[] = [];
    for (const slot of slots) {
      const bookingCount = await this.slotRepo.manager
        .createQueryBuilder()
        .select('COUNT(*)')
        .from('bookings', 'b')
        .where('b."slotId" = :slotId AND b.status = :status', {
          slotId: slot.id,
          status: 'confirmed',
        })
        .getRawOne()
        .then((r) => parseInt(r?.count || '0', 10));

      const hasSplitOpen = await this.slotRepo.manager
        .createQueryBuilder()
        .select('COUNT(*)')
        .from('bookings', 'b')
        .where(
          'b."slotId" = :slotId AND b."isSplitOpen" = true AND b.status = :status',
          { slotId: slot.id, status: 'confirmed' },
        )
        .getRawOne()
        .then((r) => parseInt(r?.count || '0', 10) > 0);

      result.push({
        ...slot,
        currentBookings: bookingCount,
        hasSplitOpen,
      });
    }

    return result;
  }

  async findById(id: string): Promise<SlotEntity | null> {
    return this.slotRepo.findOne({
      where: { id },
      relations: ['location'],
    });
  }

  async create(
    coachId: string,
    dto: CreateSlotDto,
  ): Promise<SlotEntity> {
    const today = new Date().toISOString().split('T')[0];
    if (dto.date < today) {
      throw new BadRequestException('Дата не может быть в прошлом');
    }

    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'Время начала должно быть раньше времени окончания',
      );
    }

    const existing = await this.slotRepo.findOne({
      where: { coachId, date: dto.date, startTime: dto.startTime },
    });
    if (existing) {
      throw new ConflictException(
        'Слот пересекается с существующим расписанием',
      );
    }

    const slot = this.slotRepo.create({
      coachId,
      locationId: dto.locationId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      maxPlayers: dto.maxPlayers,
      status: SlotStatus.Available,
      source: SlotSource.Manual,
    });

    return this.slotRepo.save(slot);
  }

  async update(
    id: string,
    coachId: string,
    dto: UpdateSlotDto,
  ): Promise<SlotEntity> {
    const slot = await this.slotRepo.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('Слот не найден');
    if (slot.coachId !== coachId)
      throw new ForbiddenException('Нет доступа к этому слоту');

    if (dto.status === SlotStatus.Cancelled) {
      await this.cancelSlotBookings(slot.id);
    }

    Object.assign(slot, dto);
    return this.slotRepo.save(slot);
  }

  async recalculateSlotStatus(slotId: string): Promise<void> {
    const slot = await this.slotRepo.findOne({ where: { id: slotId } });
    if (!slot) return;

    const activeBookings = await this.slotRepo.manager
      .createQueryBuilder()
      .select('COUNT(*)')
      .from('bookings', 'b')
      .where('b."slotId" = :slotId AND b.status = :status', {
        slotId,
        status: 'confirmed',
      })
      .getRawOne()
      .then((r) => parseInt(r?.count || '0', 10));

    if (activeBookings === 0) {
      slot.status = SlotStatus.Available;
    } else if (activeBookings >= slot.maxPlayers) {
      slot.status = SlotStatus.Full;
    } else {
      slot.status = SlotStatus.Booked;
    }

    await this.slotRepo.save(slot);
  }

  private async cancelSlotBookings(slotId: string): Promise<void> {
    await this.slotRepo.manager
      .createQueryBuilder()
      .update('bookings')
      .set({ status: 'cancelled' })
      .where('"slotId" = :slotId AND status = :status', {
        slotId,
        status: 'confirmed',
      })
      .execute();
  }
}
