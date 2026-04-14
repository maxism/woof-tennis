import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { UserEntity } from '../users/entities/user.entity';
import { AttachPlayerDto } from './dto/attach-player.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryMyEventsDto } from './dto/query-my-events.dto';
import { RescheduleEventDto } from './dto/reschedule-event.dto';
import { EventsFacadeService } from './events-facade.service';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsFacadeService: EventsFacadeService) {}

  @Get('my')
  getMy(@CurrentUser() user: UserEntity, @Query() query: QueryMyEventsDto) {
    return this.eventsFacadeService.getMyEvents(user, query);
  }

  @Get(':eventId')
  getOne(@Param('eventId', UuidValidationPipe) eventId: string, @CurrentUser() user: UserEntity) {
    return this.eventsFacadeService.getEventById(eventId, user);
  }

  @Post()
  create(@CurrentUser() user: UserEntity, @Body() dto: CreateEventDto) {
    return this.eventsFacadeService.createEvent(user, dto);
  }

  @Post(':eventId/attach-player')
  attachPlayer(
    @Param('eventId', UuidValidationPipe) eventId: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: AttachPlayerDto,
  ) {
    return this.eventsFacadeService.attachPlayer(eventId, user, dto);
  }

  @Post(':eventId/invite')
  invite(@Param('eventId', UuidValidationPipe) eventId: string, @CurrentUser() user: UserEntity) {
    return this.eventsFacadeService.createOrReissueInvite(eventId, user);
  }

  @Patch(':eventId/cancel')
  cancel(@Param('eventId', UuidValidationPipe) eventId: string, @CurrentUser() user: UserEntity) {
    return this.eventsFacadeService.cancelEvent(eventId, user);
  }

  @Patch(':eventId/reschedule')
  reschedule(
    @Param('eventId', UuidValidationPipe) eventId: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: RescheduleEventDto,
  ) {
    return this.eventsFacadeService.rescheduleEvent(eventId, user, dto);
  }

  @Patch(':eventId/complete')
  complete(@Param('eventId', UuidValidationPipe) eventId: string, @CurrentUser() user: UserEntity) {
    return this.eventsFacadeService.completeEvent(eventId, user);
  }
}
