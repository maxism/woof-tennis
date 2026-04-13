import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { UserEntity } from '../users/entities/user.entity';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, dto);
  }

  @Get()
  findAll(@Query() query: QueryReviewsDto) {
    return this.reviewsService.findAll(query);
  }
}
