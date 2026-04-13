import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CoachOnly } from '../../../common/decorators/coach-only.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../../common/pipes/uuid-validation.pipe';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { UserEntity } from '../../users/entities/user.entity';

@Controller('schedule-templates')
@UseGuards(JwtAuthGuard)
@CoachOnly()
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(
    @CurrentUser() user: UserEntity,
    @Query('locationId') locationId?: string,
  ) {
    return this.templatesService.findByCoach(user.id, locationId);
  }

  @Post()
  create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateTemplateDto,
  ) {
    return this.templatesService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.templatesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.templatesService.remove(id, user.id);
  }
}
