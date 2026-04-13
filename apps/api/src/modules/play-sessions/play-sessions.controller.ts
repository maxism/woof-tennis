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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { PlaySessionsService } from './play-sessions.service';
import { CreatePlaySessionDto } from './dto/create-play-session.dto';
import { QueryPlaySessionsDto } from './dto/query-play-sessions.dto';
import { UserEntity } from '../users/entities/user.entity';

@Controller('play-sessions')
@UseGuards(JwtAuthGuard)
export class PlaySessionsController {
  constructor(private readonly playSessionsService: PlaySessionsService) {}

  @Post()
  create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreatePlaySessionDto,
  ) {
    return this.playSessionsService.create(user.id, dto);
  }

  @Get('my')
  findMy(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryPlaySessionsDto,
  ) {
    return this.playSessionsService.findMy(user.id, query);
  }

  @Get('by-invite/:inviteCode')
  findByInviteCode(@Param('inviteCode') inviteCode: string) {
    return this.playSessionsService.findByInviteCode(inviteCode);
  }

  @Post(':id/join')
  join(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.playSessionsService.join(id, user.id);
  }

  @Post(':id/leave')
  leave(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.playSessionsService.leave(id, user.id);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.playSessionsService.cancel(id, user.id);
  }
}
