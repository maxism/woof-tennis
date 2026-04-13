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
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CoachOnly } from '../../../common/decorators/coach-only.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../../common/pipes/uuid-validation.pipe';
import { SlotsService } from './slots.service';
import { SlotGeneratorService } from './slot-generator.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { QuerySlotsDto } from './dto/query-slots.dto';
import { GenerateSlotsDto } from './dto/generate-slots.dto';
import { UserEntity } from '../../users/entities/user.entity';

@Controller('slots')
@UseGuards(JwtAuthGuard)
export class SlotsController {
  constructor(
    private readonly slotsService: SlotsService,
    private readonly slotGeneratorService: SlotGeneratorService,
  ) {}

  @Get()
  findAll(@Query() query: QuerySlotsDto) {
    return this.slotsService.findSlots(query);
  }

  @Post()
  @CoachOnly()
  create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateSlotDto,
  ) {
    return this.slotsService.create(user.id, dto);
  }

  @Patch(':id')
  @CoachOnly()
  update(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateSlotDto,
  ) {
    return this.slotsService.update(id, user.id, dto);
  }

  @Post('generate')
  @CoachOnly()
  generate(
    @CurrentUser() user: UserEntity,
    @Body() dto: GenerateSlotsDto,
  ) {
    return this.slotGeneratorService.generateForCoach(
      user.id,
      new Date(dto.dateFrom),
      new Date(dto.dateTo),
    );
  }
}
