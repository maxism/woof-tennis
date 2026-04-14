import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import {
  TELEGRAM_AUTH_MAX_AGE_SEC,
  validateTelegramInitData,
} from '../../common/utils/telegram-auth.util';
import { validateTelegramLoginWidget } from '../../common/utils/telegram-login-widget.util';
import { TelegramWidgetAuthDto } from './dto/telegram-widget-auth.dto';
import { AuthFailureCode } from './auth-failure-codes';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private logAuthEvent(payload: {
    channel: 'mini_app' | 'widget';
    requestId?: string;
    outcome: 'failure' | 'success';
    code?: AuthFailureCode;
    stage?: string;
  }): void {
    const line = JSON.stringify({
      event: 'auth',
      ...payload,
    });
    if (payload.outcome === 'failure') {
      this.logger.warn(line);
    } else {
      this.logger.log(line);
    }
  }

  private issueSession(user: UserEntity) {
    const payload = {
      sub: user.id,
      telegramId: Number(user.telegramId),
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async authenticateTelegram(initData: string, requestId?: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      this.logAuthEvent({
        channel: 'mini_app',
        requestId,
        outcome: 'failure',
        code: AuthFailureCode.ENV_MISSING,
        stage: 'resolve_bot_token',
      });
      throw new UnauthorizedException('Bot token не настроен');
    }

    const telegramUser = validateTelegramInitData(initData, botToken);
    if (!telegramUser) {
      this.logAuthEvent({
        channel: 'mini_app',
        requestId,
        outcome: 'failure',
        code: AuthFailureCode.MINI_APP_INVALID,
        stage: 'validate_init_data',
      });
      throw new UnauthorizedException('Невалидная подпись initData');
    }

    try {
      const user = await this.usersService.upsertFromTelegram(telegramUser);
      return this.issueSession(user);
    } catch (err) {
      this.logAuthEvent({
        channel: 'mini_app',
        requestId,
        outcome: 'failure',
        code: AuthFailureCode.DB_UPSERT_FAILED,
        stage: 'upsert_user',
      });
      throw new InternalServerErrorException('Не удалось сохранить пользователя');
    }
  }

  async authenticateTelegramWidget(
    dto: TelegramWidgetAuthDto,
    requestId?: string,
  ) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      this.logAuthEvent({
        channel: 'widget',
        requestId,
        outcome: 'failure',
        code: AuthFailureCode.ENV_MISSING,
        stage: 'resolve_bot_token',
      });
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
      this.logAuthEvent({
        channel: 'widget',
        requestId,
        outcome: 'failure',
        code: AuthFailureCode.WIDGET_SIGNATURE_INVALID,
        stage: 'validate_widget_hash',
      });
      throw new UnauthorizedException('Невалидная подпись виджета');
    }

    try {
      const user = await this.usersService.upsertFromTelegram(telegramUser);
      return this.issueSession(user);
    } catch {
      this.logAuthEvent({
        channel: 'widget',
        requestId,
        outcome: 'failure',
        code: AuthFailureCode.DB_UPSERT_FAILED,
        stage: 'upsert_user',
      });
      throw new InternalServerErrorException('Не удалось сохранить пользователя');
    }
  }
}
