import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { BookingStatus } from '@wooftennis/shared';
import { UserEntity } from '../../users/entities/user.entity';
import { SlotEntity } from '../../schedule/slots/entities/slot.entity';

@Entity('bookings')
@Unique('UQ_booking_slot_player', ['slotId', 'playerId'])
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_booking_slot_id')
  @Column('uuid')
  slotId: string;

  @ManyToOne(() => SlotEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'slotId' })
  slot: SlotEntity;

  @Index('IDX_booking_player_id')
  @Column('uuid')
  playerId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'playerId' })
  player: UserEntity;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.Confirmed,
  })
  status: BookingStatus;

  @Column({ type: 'boolean', default: false })
  isSplitOpen: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
