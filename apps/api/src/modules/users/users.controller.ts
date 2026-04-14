import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserByUsernameDto } from './dto/search-user-by-username.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: UserEntity) {
    return this.usersService.getMyProfile(user.id);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('search')
  searchByUsername(@Query() query: SearchUserByUsernameDto) {
    return this.usersService.searchPublicByUsername(query.username);
  }

  @Get(':id/public')
  getPublicProfile(@Param('id', UuidValidationPipe) id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
