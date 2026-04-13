import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { validateTelegramInitData } from '../../common/utils/telegram-auth.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async authenticateTelegram(initData: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new UnauthorizedException('Bot token не настроен');
    }

    const telegramUser = validateTelegramInitData(initData, botToken);
    if (!telegramUser) {
      throw new UnauthorizedException('Невалидная подпись initData');
    }

    const user = await this.usersService.upsertFromTelegram(telegramUser);

    const payload = {
      sub: user.id,
      telegramId: Number(user.telegramId),
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }
}
