import { HttpStatus } from '@nestjs/common';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EventsController } from './events.controller';
import { EventsFacadeService } from './events-facade.service';
import { InvitesController } from './invites.controller';
import { eventHttpError } from './events.errors';

describe('Events/Invites runtime contract (integration)', () => {
  let app: INestApplication;
  const service = {
    getMyEvents: jest.fn(),
    getEventById: jest.fn(),
    createEvent: jest.fn(),
    attachPlayer: jest.fn(),
    createOrReissueInvite: jest.fn(),
    getInviteByCode: jest.fn(),
    acceptInvite: jest.fn(),
    declineInvite: jest.fn(),
    cancelEvent: jest.fn(),
    rescheduleEvent: jest.fn(),
    completeEvent: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EventsController, InvitesController],
      providers: [{ provide: EventsFacadeService, useValue: service }],
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

  it('GET /events/my returns paginated contract', async () => {
    service.getMyEvents.mockResolvedValue({ items: [], total: 0 });
    const res = await request(app.getHttpServer())
      .get('/api/v1/events/my?role=coach&dateFrom=2026-04-14T10:00:00.000Z&dateTo=2026-04-20T10:00:00.000Z')
      .set('x-role', 'coach')
      .expect(200);

    expect(res.body).toEqual({ items: [], total: 0 });
    expect(service.getMyEvents).toHaveBeenCalled();
  });

  it('GET /events/my returns 400 for invalid role', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/events/my?role=bad&dateFrom=2026-04-14T10:00:00.000Z&dateTo=2026-04-20T10:00:00.000Z')
      .expect(400);
  });

  it('PATCH /events/:id/cancel bubbles ROLE_FORBIDDEN code', async () => {
    service.cancelEvent.mockRejectedValue(
      eventHttpError(HttpStatus.FORBIDDEN, 'Требуется доступ тренера', 'ROLE_FORBIDDEN', 'Forbidden'),
    );

    const res = await request(app.getHttpServer())
      .patch('/api/v1/events/11111111-1111-4111-8111-111111111111/cancel')
      .set('x-role', 'player')
      .expect(403);

    expect(res.body.code).toBe('ROLE_FORBIDDEN');
  });

  it('POST /invites/:id/accept bubbles INVITE_EXPIRED code', async () => {
    service.acceptInvite.mockRejectedValue(
      eventHttpError(HttpStatus.GONE, 'Срок приглашения истек', 'INVITE_EXPIRED'),
    );

    const res = await request(app.getHttpServer())
      .post('/api/v1/invites/11111111-1111-4111-8111-111111111111/accept')
      .expect(410);

    expect(res.body.code).toBe('INVITE_EXPIRED');
  });
});
