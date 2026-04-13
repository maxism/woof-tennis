import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleTemplateEntity } from './entities/schedule-template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(ScheduleTemplateEntity)
    private readonly templateRepo: Repository<ScheduleTemplateEntity>,
  ) {}

  async findByCoach(
    coachId: string,
    locationId?: string,
  ): Promise<ScheduleTemplateEntity[]> {
    const qb = this.templateRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.location', 'location')
      .where('t.coachId = :coachId', { coachId });

    if (locationId) {
      qb.andWhere('t.locationId = :locationId', { locationId });
    }

    return qb.orderBy('t.dayOfWeek', 'ASC').getMany();
  }

  async findActiveByCoach(coachId: string): Promise<ScheduleTemplateEntity[]> {
    return this.templateRepo.find({
      where: { coachId, isActive: true },
      relations: ['location'],
    });
  }

  async create(
    coachId: string,
    dto: CreateTemplateDto,
  ): Promise<ScheduleTemplateEntity> {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'Время начала должно быть раньше времени окончания',
      );
    }

    const existing = await this.templateRepo.findOne({
      where: {
        coachId,
        locationId: dto.locationId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Шаблон с такими параметрами уже существует',
      );
    }

    const template = this.templateRepo.create({ ...dto, coachId });
    return this.templateRepo.save(template);
  }

  async update(
    id: string,
    coachId: string,
    dto: UpdateTemplateDto,
  ): Promise<ScheduleTemplateEntity> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Шаблон не найден');
    if (template.coachId !== coachId)
      throw new ForbiddenException('Нет доступа к этому шаблону');

    Object.assign(template, dto);
    return this.templateRepo.save(template);
  }

  async remove(id: string, coachId: string): Promise<void> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Шаблон не найден');
    if (template.coachId !== coachId)
      throw new ForbiddenException('Нет доступа к этому шаблону');

    await this.templateRepo.remove(template);
  }
}
