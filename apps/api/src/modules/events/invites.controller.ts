import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { UserEntity } from '../users/entities/user.entity';
import { EventsFacadeService } from './events-facade.service';

@Controller('invites')
@UseGuards(JwtAuthGuard)
export class InvitesController {
  constructor(private readonly eventsFacadeService: EventsFacadeService) {}

  @Get(':code')
  byCode(@Param('code') code: string) {
    return this.eventsFacadeService.getInviteByCode(code);
  }

  @Post(':inviteId/accept')
  accept(@Param('inviteId', UuidValidationPipe) inviteId: string, @CurrentUser() user: UserEntity) {
    return this.eventsFacadeService.acceptInvite(inviteId, user);
  }

  @Post(':inviteId/decline')
  decline(@Param('inviteId', UuidValidationPipe) inviteId: string, @CurrentUser() user: UserEntity) {
    return this.eventsFacadeService.declineInvite(inviteId, user);
  }
}
