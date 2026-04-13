import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { NotificationsService } from './notifications.service';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { UserEntity } from '../users/entities/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  findAll(
    @CurrentUser() user: UserEntity,
    @Query() query: QueryNotificationsDto,
  ) {
    return this.notificationsService.findUserNotifications(user.id, query);
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Post('read-all')
  markAllAsRead(@CurrentUser() user: UserEntity) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}
