import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PlaySessionStatus,
  ParticipantStatus,
  NotificationType,
} from '@wooftennis/shared';
import { PlaySessionEntity } from './entities/play-session.entity';
import { PlaySessionParticipantEntity } from './entities/play-session-participant.entity';
import { CreatePlaySessionDto } from './dto/create-play-session.dto';
import { QueryPlaySessionsDto } from './dto/query-play-sessions.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { generateInviteCode } from '../../common/utils/invite-code.util';

@Injectable()
export class PlaySessionsService {
  constructor(
    @InjectRepository(PlaySessionEntity)
    private readonly sessionRepo: Repository<PlaySessionEntity>,
    @InjectRepository(PlaySessionParticipantEntity)
    private readonly participantRepo: Repository<PlaySessionParticipantEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    creatorId: string,
    dto: CreatePlaySessionDto,
  ): Promise<PlaySessionEntity> {
    let inviteCode: string;
    let attempts = 0;
    do {
      inviteCode = generateInviteCode();
      const exists = await this.sessionRepo.findOne({
        where: { inviteCode },
      });
      if (!exists) break;
      attempts++;
    } while (attempts < 10);

    const session = this.sessionRepo.create({
      creatorId,
      locationText: dto.locationText,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime || null,
      comment: dto.comment || null,
      inviteCode,
      maxPlayers: dto.maxPlayers,
      status: PlaySessionStatus.Open,
    });

    const saved = await this.sessionRepo.save(session);

    const participant = this.participantRepo.create({
      playSessionId: saved.id,
      playerId: creatorId,
      status: ParticipantStatus.Confirmed,
    });
    await this.participantRepo.save(participant);

    return this.findByIdWithParticipants(saved.id);
  }

  async findMy(
    userId: string,
    query: QueryPlaySessionsDto,
  ): Promise<PlaySessionEntity[]> {
    const qb = this.sessionRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.participants', 'p')
      .leftJoinAndSelect('p.player', 'player')
      .where(
        `(s.creatorId = :userId OR EXISTS (
          SELECT 1 FROM play_session_participants pp
          WHERE pp."playSessionId" = s.id AND pp."playerId" = :userId
        ))`,
        { userId },
      );

    if (query.dateFrom) {
      qb.andWhere('s.date >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('s.date <= :dateTo', { dateTo: query.dateTo });
    }

    return qb.orderBy('s.date', 'ASC').addOrderBy('s.startTime', 'ASC').getMany();
  }

  async findByInviteCode(inviteCode: string): Promise<PlaySessionEntity> {
    const session = await this.sessionRepo.findOne({
      where: { inviteCode },
      relations: ['participants', 'participants.player'],
    });
    if (!session || session.status === PlaySessionStatus.Cancelled) {
      throw new NotFoundException('Сессия не найдена или неактивна');
    }
    return session;
  }

  async join(sessionId: string, userId: string): Promise<PlaySessionEntity> {
    const session = await this.findByIdWithParticipants(sessionId);

    if (session.status !== PlaySessionStatus.Open) {
      throw new BadRequestException('Сессия не доступна для присоединения');
    }

    const activeParticipants = session.participants.filter(
      (p) => p.status === ParticipantStatus.Confirmed,
    );

    if (activeParticipants.length >= session.maxPlayers) {
      throw new BadRequestException('Все места заняты');
    }

    const alreadyJoined = activeParticipants.find(
      (p) => p.playerId === userId,
    );
    if (alreadyJoined) {
      throw new ConflictException('Вы уже являетесь участником');
    }

    const participant = this.participantRepo.create({
      playSessionId: sessionId,
      playerId: userId,
      status: ParticipantStatus.Confirmed,
    });
    await this.participantRepo.save(participant);

    await this.notificationsService.send({
      userId: session.creatorId,
      type: NotificationType.PlaySessionJoined,
      title: 'Новый участник игры',
      body: `Новый участник присоединился к вашей игре ${session.date}`,
      metadata: { playSessionId: session.id },
    });

    return this.findByIdWithParticipants(sessionId);
  }

  async leave(sessionId: string, userId: string): Promise<PlaySessionEntity> {
    const session = await this.findByIdWithParticipants(sessionId);

    if (session.creatorId === userId) {
      throw new BadRequestException(
        'Создатель не может покинуть сессию, только отменить',
      );
    }

    const participant = await this.participantRepo.findOne({
      where: {
        playSessionId: sessionId,
        playerId: userId,
        status: ParticipantStatus.Confirmed,
      },
    });
    if (!participant) {
      throw new NotFoundException('Вы не являетесь участником');
    }

    participant.status = ParticipantStatus.Cancelled;
    await this.participantRepo.save(participant);

    return this.findByIdWithParticipants(sessionId);
  }

  async cancel(sessionId: string, userId: string): Promise<PlaySessionEntity> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Сессия не найдена');
    if (session.creatorId !== userId) {
      throw new ForbiddenException('Только создатель может отменить сессию');
    }

    session.status = PlaySessionStatus.Cancelled;
    return this.sessionRepo.save(session);
  }

  private async findByIdWithParticipants(
    id: string,
  ): Promise<PlaySessionEntity> {
    const session = await this.sessionRepo.findOne({
      where: { id },
      relations: ['participants', 'participants.player'],
    });
    if (!session) throw new NotFoundException('Сессия не найдена');
    return session;
  }
}
