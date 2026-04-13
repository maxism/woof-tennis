import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepo: Repository<LocationEntity>,
  ) {}

  async findByCoach(
    coachId: string,
    isActive?: boolean,
  ): Promise<LocationEntity[]> {
    const where: any = { coachId };
    if (isActive !== undefined) where.isActive = isActive;
    return this.locationRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<LocationEntity | null> {
    return this.locationRepo.findOne({ where: { id } });
  }

  async create(
    coachId: string,
    dto: CreateLocationDto,
    photoUrl?: string,
  ): Promise<LocationEntity> {
    const location = this.locationRepo.create({
      coachId,
      name: dto.name,
      address: dto.address,
      photoUrl: photoUrl || null,
    });
    return this.locationRepo.save(location);
  }

  async update(
    id: string,
    coachId: string,
    dto: UpdateLocationDto,
    photoUrl?: string,
  ): Promise<LocationEntity> {
    const location = await this.findById(id);
    if (!location) throw new NotFoundException('Локация не найдена');
    if (location.coachId !== coachId)
      throw new ForbiddenException('Нет доступа к этой локации');

    Object.assign(location, dto);
    if (photoUrl) location.photoUrl = photoUrl;
    return this.locationRepo.save(location);
  }

  async deactivate(id: string, coachId: string): Promise<void> {
    const location = await this.findById(id);
    if (!location) throw new NotFoundException('Локация не найдена');
    if (location.coachId !== coachId)
      throw new ForbiddenException('Нет доступа к этой локации');

    location.isActive = false;
    await this.locationRepo.save(location);
  }
}
