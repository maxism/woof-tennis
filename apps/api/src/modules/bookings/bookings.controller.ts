import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CoachOnly } from '../../common/decorators/coach-only.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { UserEntity } from '../users/entities/user.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('my')
  findMy(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryBookingsDto,
  ) {
    return this.bookingsService.findMyBookings(user.id, query);
  }

  @Get('coach')
  @CoachOnly()
  findCoach(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryBookingsDto,
  ) {
    return this.bookingsService.findCoachBookings(user.id, query);
  }

  @Post()
  create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.id, dto);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, user.id, user.isCoach);
  }

  @Post(':id/open-split')
  openSplit(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.openSplit(id, user.id);
  }

  @Post(':id/close-split')
  closeSplit(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.closeSplit(id, user.id);
  }

  @Patch(':id/complete')
  @CoachOnly()
  complete(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.complete(id, user.id);
  }

  @Patch(':id/no-show')
  @CoachOnly()
  noShow(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.noShow(id, user.id);
  }
}
