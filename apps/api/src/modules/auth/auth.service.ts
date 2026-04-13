import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import {
  TELEGRAM_AUTH_MAX_AGE_SEC,
  validateTelegramInitData,
} from '../../common/utils/telegram-auth.util';
import { validateTelegramLoginWidget } from '../../common/utils/telegram-login-widget.util';
import { TelegramWidgetAuthDto } from './dto/telegram-widget-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private logAuthFailure(reason: string): void {
    this.logger.warn(`Telegram auth failed: ${reason}`);
  }

  private issueSession(user: UserEntity) {
    const payload = {
      sub: user.id,
      telegramId: Number(user.telegramId),
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async authenticateTelegram(initData: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      this.logAuthFailure('bot_token_not_configured');
      throw new UnauthorizedException('Bot token не настроен');
    }

    const telegramUser = validateTelegramInitData(initData, botToken);
    if (!telegramUser) {
      this.logAuthFailure('mini_app_invalid_signature_or_stale');
      throw new UnauthorizedException('Невалидная подпись initData');
    }

    const user = await this.usersService.upsertFromTelegram(telegramUser);
    return this.issueSession(user);
  }

  async authenticateTelegramWidget(dto: TelegramWidgetAuthDto) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      this.logAuthFailure('bot_token_not_configured');
      throw new UnauthorizedException('Bot token не настроен');
    }

    const payload = {
      id: dto.id,
      first_name: dto.first_name,
      auth_date: dto.auth_date,
      hash: dto.hash,
      ...(dto.last_name !== undefined ? { last_name: dto.last_name } : {}),
      ...(dto.username !== undefined ? { username: dto.username } : {}),
      ...(dto.photo_url !== undefined ? { photo_url: dto.photo_url } : {}),
    };

    const telegramUser = validateTelegramLoginWidget(
      payload,
      botToken,
      TELEGRAM_AUTH_MAX_AGE_SEC,
    );
    if (!telegramUser) {
      this.logAuthFailure('widget_invalid_signature_or_stale');
      throw new UnauthorizedException('Невалидная подпись виджета');
    }

    const user = await this.usersService.upsertFromTelegram(telegramUser);
    return this.issueSession(user);
  }
}
