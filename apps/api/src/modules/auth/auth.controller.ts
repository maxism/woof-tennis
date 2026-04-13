import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { TelegramWidgetAuthDto } from './dto/telegram-widget-auth.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 30, ttl: 60000 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  authenticateTelegram(@Body() dto: TelegramAuthDto) {
    return this.authService.authenticateTelegram(dto.initData);
  }

  @Post('telegram/widget')
  authenticateTelegramWidget(@Body() dto: TelegramWidgetAuthDto) {
    return this.authService.authenticateTelegramWidget(dto);
  }
}
