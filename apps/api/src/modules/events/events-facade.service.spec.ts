import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SlotStatus } from '@wooftennis/shared';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { SlotEntity } from '../schedule/slots/entities/slot.entity';
import { UserEntity } from '../users/entities/user.entity';
import { EventInviteEntity } from './entities/event-invite.entity';
import { EventsFacadeService } from './events-facade.service';
import { BookingEntity } from '../bookings/entities/booking.entity';

describe('EventsFacadeService', () => {
  let service: EventsFacadeService;
  let inviteRepo: jest.Mocked<Repository<EventInviteEntity>>;
  let slotRepo: jest.Mocked<Repository<SlotEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsFacadeService,
        {
          provide: getRepositoryToken(SlotEntity),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: {
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EventInviteEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: NotificationsService,
          useValue: { send: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(EventsFacadeService);
    inviteRepo = module.get(getRepositoryToken(EventInviteEntity));
    slotRepo = module.get(getRepositoryToken(SlotEntity));
  });

  it('throws INVITE_EXPIRED for expired accept action', async () => {
    inviteRepo.findOne.mockResolvedValue({
      id: '11111111-1111-1111-1111-111111111111',
      slotId: '22222222-2222-2222-2222-222222222222',
      coachId: '33333333-3333-3333-3333-333333333333',
      playerId: null,
      code: 'abc123',
      status: 'pending' as any,
      expiresAt: new Date(Date.now() - 60_000),
    } as EventInviteEntity);
    inviteRepo.save.mockResolvedValue({} as EventInviteEntity);

    await expect(
      service.acceptInvite('11111111-1111-1111-1111-111111111111', {
        id: '44444444-4444-4444-4444-444444444444',
      } as UserEntity),
    ).rejects.toMatchObject({
      response: { code: 'INVITE_EXPIRED' },
    });
  });

  it('throws EVENT_NOT_AVAILABLE when slot is cancelled on attach', async () => {
    slotRepo.findOne.mockResolvedValue({
      id: '11111111-1111-1111-1111-111111111111',
      coachId: '55555555-5555-5555-5555-555555555555',
      locationId: '66666666-6666-6666-6666-666666666666',
      date: '2026-04-20',
      startTime: '09:00:00',
      endTime: '10:00:00',
      maxPlayers: 1,
      status: SlotStatus.Cancelled,
      source: 'manual' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as SlotEntity);

    await expect(
      service.attachPlayer(
        '11111111-1111-1111-1111-111111111111',
        { id: '55555555-5555-5555-5555-555555555555', isCoach: true } as UserEntity,
        { playerId: '77777777-7777-7777-7777-777777777777' },
      ),
    ).rejects.toMatchObject({
      response: { code: 'EVENT_NOT_AVAILABLE' },
    });
  });
});
