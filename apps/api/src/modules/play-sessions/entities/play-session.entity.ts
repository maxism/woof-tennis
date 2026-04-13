import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PlaySessionStatus } from '@wooftennis/shared';
import { UserEntity } from '../../users/entities/user.entity';
import { PlaySessionParticipantEntity } from './play-session-participant.entity';

@Entity('play_sessions')
export class PlaySessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_play_session_creator_id')
  @Column('uuid')
  creatorId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creatorId' })
  creator: UserEntity;

  @Column({ type: 'varchar', length: 500 })
  locationText: string;

  @Index('IDX_play_session_date')
  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string | null;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'varchar', length: 20, unique: true })
  inviteCode: string;

  @Column({
    type: 'enum',
    enum: PlaySessionStatus,
    default: PlaySessionStatus.Open,
  })
  status: PlaySessionStatus;

  @Column({ type: 'smallint', default: 2 })
  maxPlayers: number;

  @OneToMany(() => PlaySessionParticipantEntity, (p) => p.playSession, {
    cascade: true,
  })
  participants: PlaySessionParticipantEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
