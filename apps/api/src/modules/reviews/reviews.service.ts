import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatus, NotificationType } from '@wooftennis/shared';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    private readonly bookingsService: BookingsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    reviewerId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    const booking = await this.bookingsService.findById(dto.bookingId);
    if (!booking) throw new NotFoundException('Бронирование не найдено');

    if (booking.status !== BookingStatus.Completed) {
      throw new BadRequestException(
        'Отзыв можно оставить только после завершённой тренировки',
      );
    }

    const isPlayer = booking.playerId === reviewerId;
    const isCoach = booking.slot.coachId === reviewerId;
    if (!isPlayer && !isCoach) {
      throw new BadRequestException(
        'Вы не являетесь участником этого бронирования',
      );
    }

    const existing = await this.reviewRepo.findOne({
      where: { bookingId: dto.bookingId, reviewerId },
    });
    if (existing) {
      throw new ConflictException('Вы уже оставили отзыв на это бронирование');
    }

    const review = this.reviewRepo.create({
      bookingId: dto.bookingId,
      reviewerId,
      targetId: dto.targetId,
      poopRating: dto.poopRating,
      starRating: dto.starRating,
      recommendation: dto.recommendation || null,
      comment: dto.comment || null,
    });

    const saved = await this.reviewRepo.save(review);

    await this.notificationsService.send({
      userId: dto.targetId,
      type: NotificationType.ReviewReceived,
      title: 'Новый отзыв',
      body: 'Вам оставили новый отзыв о тренировке',
      metadata: { reviewId: saved.id, bookingId: dto.bookingId },
    });

    return saved;
  }

  async findAll(query: QueryReviewsDto) {
    const qb = this.reviewRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.reviewer', 'reviewer')
      .leftJoinAndSelect('r.target', 'target');

    if (query.targetId) {
      qb.andWhere('r.targetId = :targetId', { targetId: query.targetId });
    }
    if (query.reviewerId) {
      qb.andWhere('r.reviewerId = :reviewerId', {
        reviewerId: query.reviewerId,
      });
    }

    qb.orderBy('r.createdAt', 'DESC');

    const [items, total] = await qb
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();

    return new PaginatedResponseDto(items, total, query.page, query.limit);
  }
}
