import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MakeupStatus } from '@wooftennis/shared';
import { UserEntity } from '../../users/entities/user.entity';
import { BookingEntity } from '../../bookings/entities/booking.entity';

@Entity('makeup_debts')
export class MakeupDebtEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_makeup_debt_coach_id')
  @Column('uuid')
  coachId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'coachId' })
  coach: UserEntity;

  @Index('IDX_makeup_debt_player_id')
  @Column('uuid')
  playerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'playerId' })
  player: UserEntity;

  @Column('uuid')
  originalBookingId: string;

  @ManyToOne(() => BookingEntity)
  @JoinColumn({ name: 'originalBookingId' })
  originalBooking: BookingEntity;

  @Column({ type: 'uuid', nullable: true })
  makeupBookingId: string | null;

  @ManyToOne(() => BookingEntity, { nullable: true })
  @JoinColumn({ name: 'makeupBookingId' })
  makeupBooking: BookingEntity | null;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({
    type: 'enum',
    enum: MakeupStatus,
    default: MakeupStatus.Pending,
  })
  status: MakeupStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
