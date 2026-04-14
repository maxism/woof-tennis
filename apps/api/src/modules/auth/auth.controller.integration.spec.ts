import { createHash, createHmac } from 'crypto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { buildLoginWidgetDataCheckString } from '../../common/utils/telegram-login-widget.util';

function signWidget(
  botToken: string,
  params: {
    id: number;
    first_name: string;
    auth_date: number;
  },
): string {
  const dataCheckString = buildLoginWidgetDataCheckString({
    ...params,
    hash: '',
  });
  const secretKey = createHash('sha256').update(botToken).digest();
  return createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
}

describe('AuthController (integration) POST /auth/telegram/widget', () => {
  let app: INestApplication;
  let upsertFromTelegram: jest.Mock;

  const botToken = 'integration-test:bot-token';

  beforeAll(async () => {
    process.env.TELEGRAM_BOT_TOKEN = botToken;
  });

  beforeEach(async () => {
    upsertFromTelegram = jest.fn();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'default',
            ttl: 60000,
            limit: 100,
          },
        ]),
        JwtModule.register({
          secret: 'integration-test-jwt-secret-32chars-min',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { upsertFromTelegram },
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.use((req, _res, next) => {
      req.requestId = 'test-request-id';
      next();
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 200 and accessToken for valid widget payload', async () => {
    const authDate = Math.floor(Date.now() / 1000);
    const body = {
      id: 424242,
      first_name: 'Иван',
      auth_date: authDate,
      hash: signWidget(botToken, {
        id: 424242,
        first_name: 'Иван',
        auth_date: authDate,
      }),
    };
    upsertFromTelegram.mockResolvedValue({
      id: '11111111-1111-1111-1111-111111111111',
      telegramId: 424242,
      firstName: 'Иван',
      lastName: null,
      username: null,
      photoUrl: null,
      isCoach: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/telegram/widget')
      .send(body)
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(upsertFromTelegram).toHaveBeenCalled();
  });

  it('returns 401 for invalid hash', async () => {
    const authDate = Math.floor(Date.now() / 1000);
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/telegram/widget')
      .send({
        id: 1,
        first_name: 'X',
        auth_date: authDate,
        hash: 'deadbeef',
      })
      .expect(401);

    expect(res.body.requestId).toBe('test-request-id');
  });

  it('returns 401 when TELEGRAM_BOT_TOKEN unset at request time', async () => {
    const prev = process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_BOT_TOKEN;
    const authDate = Math.floor(Date.now() / 1000);
    try {
      await request(app.getHttpServer())
        .post('/api/v1/auth/telegram/widget')
        .send({
          id: 2,
          first_name: 'Z',
          auth_date: authDate,
          hash: 'any',
        })
        .expect(401);
    } finally {
      process.env.TELEGRAM_BOT_TOKEN = prev;
    }
  });

  it('returns 500 when upsert fails', async () => {
    const authDate = Math.floor(Date.now() / 1000);
    upsertFromTelegram.mockRejectedValue(new Error('database down'));

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/telegram/widget')
      .send({
        id: 99,
        first_name: 'Y',
        auth_date: authDate,
        hash: signWidget(botToken, {
          id: 99,
          first_name: 'Y',
          auth_date: authDate,
        }),
      })
      .expect(500);

    expect(res.body.requestId).toBe('test-request-id');
  });
});
