import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ParticipantStatus } from '@wooftennis/shared';
import { UserEntity } from '../../users/entities/user.entity';
import { PlaySessionEntity } from './play-session.entity';

@Entity('play_session_participants')
@Unique('UQ_participant_unique', ['playSessionId', 'playerId'])
export class PlaySessionParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  playSessionId: string;

  @ManyToOne(() => PlaySessionEntity, (s) => s.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playSessionId' })
  playSession: PlaySessionEntity;

  @Column('uuid')
  playerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'playerId' })
  player: UserEntity;

  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.Confirmed,
  })
  status: ParticipantStatus;

  @CreateDateColumn()
  createdAt: Date;
}
