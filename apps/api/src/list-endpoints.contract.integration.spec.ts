import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { BookingsController } from './modules/bookings/bookings.controller';
import { BookingsService } from './modules/bookings/bookings.service';
import { LocationsController } from './modules/locations/locations.controller';
import { LocationsService } from './modules/locations/locations.service';
import { PlaySessionsController } from './modules/play-sessions/play-sessions.controller';
import { PlaySessionsService } from './modules/play-sessions/play-sessions.service';

describe('List endpoints contract matrix', () => {
  let app: INestApplication;
  const bookingsService = {
    findMyBookings: jest.fn(),
    findCoachBookings: jest.fn(),
  };
  const playSessionsService = {
    findMy: jest.fn(),
  };
  const locationsService = {
    findByCoach: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        BookingsController,
        PlaySessionsController,
        LocationsController,
      ],
      providers: [
        { provide: BookingsService, useValue: bookingsService },
        { provide: PlaySessionsService, useValue: playSessionsService },
        { provide: LocationsService, useValue: locationsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.use((req, _res, next) => {
      req.user = {
        id: '11111111-1111-1111-1111-111111111111',
        isCoach: req.headers['x-role'] === 'coach',
      };
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
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('bookings/coach: 200 for coach with valid query', async () => {
    bookingsService.findCoachBookings.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
    });
    await request(app.getHttpServer())
      .get('/api/v1/bookings/coach?page=1&limit=20')
      .set('x-role', 'coach')
      .expect(200);
  });

  it('bookings/coach: 403 for player role', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/bookings/coach')
      .set('x-role', 'player')
      .expect(403);
  });

  it('bookings/coach: 400 for invalid status query', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/bookings/coach?status=bad_status')
      .set('x-role', 'coach')
      .expect(400);
  });

  it('play-sessions/my: 200 with page and limit', async () => {
    playSessionsService.findMy.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
    });
    const res = await request(app.getHttpServer())
      .get('/api/v1/play-sessions/my?page=1&limit=20')
      .set('x-role', 'player')
      .expect(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
  });

  it('play-sessions/my: 400 for invalid limit', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/play-sessions/my?limit=0')
      .set('x-role', 'player')
      .expect(400);
  });

  it('locations: 200 for coach and valid query', async () => {
    locationsService.findByCoach.mockResolvedValue([]);
    await request(app.getHttpServer())
      .get('/api/v1/locations?isActive=true')
      .set('x-role', 'coach')
      .expect(200);
    expect(locationsService.findByCoach).toHaveBeenCalledWith(
      '11111111-1111-1111-1111-111111111111',
      true,
    );
  });

  it('locations: 403 for player role', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/locations')
      .set('x-role', 'player')
      .expect(403);
  });

  it('locations: 400 for unsupported query key', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/locations?foo=1')
      .set('x-role', 'coach')
      .expect(400);
  });
});

