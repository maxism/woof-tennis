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
import { MakeupService } from './makeup.service';
import { CreateMakeupDebtDto } from './dto/create-makeup-debt.dto';
import { ResolveMakeupDebtDto } from './dto/resolve-makeup-debt.dto';
import { UserEntity } from '../users/entities/user.entity';

@Controller('makeup-debts')
@UseGuards(JwtAuthGuard)
export class MakeupController {
  constructor(private readonly makeupService: MakeupService) {}

  @Post()
  @CoachOnly()
  create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateMakeupDebtDto,
  ) {
    return this.makeupService.create(user.id, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: UserEntity,
    @Query('role') role: 'coach' | 'player' = 'player',
    @Query('playerId') playerId?: string,
    @Query('status') status?: string,
  ) {
    return this.makeupService.findAll(user.id, role, playerId, status);
  }

  @Patch(':id/resolve')
  @CoachOnly()
  resolve(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: ResolveMakeupDebtDto,
  ) {
    return this.makeupService.resolve(id, user.id, dto);
  }

  @Patch(':id/cancel')
  @CoachOnly()
  cancel(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.makeupService.cancel(id, user.id);
  }
}
