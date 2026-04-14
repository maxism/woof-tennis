import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { InviteStatus } from '@wooftennis/shared';
import { SlotEntity } from '../../schedule/slots/entities/slot.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('event_invites')
@Unique('UQ_event_invite_code', ['code'])
export class EventInviteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_event_invite_slot_id')
  @Column('uuid')
  slotId: string;

  @ManyToOne(() => SlotEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slotId' })
  slot: SlotEntity;

  @Index('IDX_event_invite_coach_id')
  @Column('uuid')
  coachId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coachId' })
  coach: UserEntity;

  @Index('IDX_event_invite_player_id')
  @Column({ type: 'uuid', nullable: true })
  playerId: string | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'playerId' })
  player: UserEntity | null;

  @Column({ type: 'varchar', length: 64 })
  code: string;

  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.Pending,
  })
  status: InviteStatus;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
