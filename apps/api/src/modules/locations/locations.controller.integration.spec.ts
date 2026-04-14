import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

describe('LocationsController guard/runtime contract', () => {
  let app: INestApplication;
  const findByCoach = jest.fn();

  const jwtGuardStub = {
    canActivate: (ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      req.user = {
        id: '22222222-2222-2222-2222-222222222222',
        isCoach: req.headers['x-role'] === 'coach',
      };
      return true;
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [{ provide: LocationsService, useValue: { findByCoach } }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtGuardStub)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('returns 200 for coach on /locations', async () => {
    findByCoach.mockResolvedValue([]);
    await request(app.getHttpServer())
      .get('/api/v1/locations')
      .set('x-role', 'coach')
      .expect(200);
  });

  it('returns 400 for coach + invalid query key', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/locations?foo=1')
      .set('x-role', 'coach')
      .expect(400);
  });

  it('returns 403 for player role', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/locations')
      .set('x-role', 'player')
      .expect(403);
  });
});

