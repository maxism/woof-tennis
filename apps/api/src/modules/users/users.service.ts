import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { TelegramUser } from '../../common/utils/telegram-auth.util';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByTelegramId(telegramId: number): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { telegramId } });
  }

  async upsertFromTelegram(tgUser: TelegramUser): Promise<UserEntity> {
    let user = await this.findByTelegramId(tgUser.id);

    if (user) {
      user.firstName = tgUser.first_name;
      user.lastName = tgUser.last_name || null;
      user.username = tgUser.username || null;
      user.photoUrl = tgUser.photo_url || null;
      return this.userRepo.save(user);
    }

    const newUser = this.userRepo.create({
      telegramId: tgUser.id,
      firstName: tgUser.first_name,
      lastName: tgUser.last_name || null,
      username: tgUser.username || null,
      photoUrl: tgUser.photo_url || null,
    });
    return this.userRepo.save(newUser);
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async getMyProfile(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const stats = await this.getUserStats(userId, user.isCoach);
    return { ...user, stats };
  }

  async getPublicProfile(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const { telegramId, updatedAt, ...publicData } = user;

    if (user.isCoach) {
      const stats = await this.getCoachPublicStats(userId);
      return { ...publicData, stats };
    }

    return publicData;
  }

  async searchPublicByUsername(rawUsername: string) {
    const normalized = rawUsername.trim().replace(/^@/, '').toLowerCase();
    if (!normalized) {
      return [];
    }

    const users = await this.userRepo
      .createQueryBuilder('u')
      .select([
        'u.id',
        'u.firstName',
        'u.lastName',
        'u.username',
        'u.photoUrl',
        'u.isCoach',
      ])
      .where('u.username IS NOT NULL')
      .andWhere("u.username <> ''")
      .andWhere('LOWER(u.username) = :username', { username: normalized })
      .limit(5)
      .getMany();

    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      photoUrl: u.photoUrl,
      isCoach: u.isCoach,
    }));
  }

  private async getUserStats(userId: string, isCoach: boolean) {
    const qb = this.userRepo.manager;

    const totalBookingsAsPlayer = await qb
      .createQueryBuilder()
      .select('COUNT(*)')
      .from('bookings', 'b')
      .where('b."playerId" = :userId', { userId })
      .getRawOne()
      .then((r) => parseInt(r?.count || '0', 10));

    let totalBookingsAsCoach = 0;
    if (isCoach) {
      totalBookingsAsCoach = await qb
        .createQueryBuilder()
        .select('COUNT(*)')
        .from('bookings', 'b')
        .innerJoin('slots', 's', 's.id = b."slotId"')
        .where('s."coachId" = :userId', { userId })
        .getRawOne()
        .then((r) => parseInt(r?.count || '0', 10));
    }

    const avgRatingAsPlayer = await qb
      .createQueryBuilder()
      .select('AVG(r."ratingValue")', 'avg')
      .from('reviews', 'r')
      .where('r."targetId" = :userId', { userId })
      .getRawOne()
      .then((r) => (r?.avg ? parseFloat(r.avg) : null));

    const avgRatingAsCoach = isCoach ? avgRatingAsPlayer : null;

    const pendingMakeupDebts = await qb
      .createQueryBuilder()
      .select('COUNT(*)')
      .from('makeup_debts', 'm')
      .where('m."playerId" = :userId AND m.status = :status', {
        userId,
        status: 'pending',
      })
      .getRawOne()
      .then((r) => parseInt(r?.count || '0', 10));

    return {
      totalBookingsAsPlayer,
      totalBookingsAsCoach,
      avgRatingAsPlayer,
      avgRatingAsCoach,
      pendingMakeupDebts,
    };
  }

  private async getCoachPublicStats(userId: string) {
    const qb = this.userRepo.manager;

    const totalStudents = await qb
      .createQueryBuilder()
      .select('COUNT(DISTINCT b."playerId")', 'count')
      .from('bookings', 'b')
      .innerJoin('slots', 's', 's.id = b."slotId"')
      .where('s."coachId" = :userId', { userId })
      .getRawOne()
      .then((r) => parseInt(r?.count || '0', 10));

    const reviewStats = await qb
      .createQueryBuilder()
      .select('AVG(r."ratingValue")', 'avg')
      .addSelect('COUNT(*)', 'count')
      .from('reviews', 'r')
      .where('r."targetId" = :userId', { userId })
      .getRawOne();

    return {
      totalStudents,
      avgRating: reviewStats?.avg ? parseFloat(reviewStats.avg) : null,
      totalReviews: parseInt(reviewStats?.count || '0', 10),
    };
  }
}
