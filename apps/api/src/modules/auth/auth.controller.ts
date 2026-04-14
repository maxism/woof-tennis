import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { TelegramWidgetAuthDto } from './dto/telegram-widget-auth.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 30, ttl: 60000 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @HttpCode(HttpStatus.OK)
  authenticateTelegram(@Body() dto: TelegramAuthDto, @Req() req: Request) {
    return this.authService.authenticateTelegram(dto.initData, req.requestId);
  }

  @Post('telegram/widget')
  @HttpCode(HttpStatus.OK)
  authenticateTelegramWidget(
    @Body() dto: TelegramWidgetAuthDto,
    @Req() req: Request,
  ) {
    return this.authService.authenticateTelegramWidget(dto, req.requestId);
  }
}
