import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { BookingEntity } from '../../bookings/entities/booking.entity';

@Entity('reviews')
@Unique('UQ_review_unique', ['bookingId', 'reviewerId'])
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  bookingId: string;

  @ManyToOne(() => BookingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @Column('uuid')
  reviewerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: UserEntity;

  @Index('IDX_review_target_id')
  @Column('uuid')
  targetId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'targetId' })
  target: UserEntity;

  @Column({ type: 'smallint' })
  ratingValue: number;

  @Column({ type: 'varchar', length: 16 })
  ratingStyle: 'poop' | 'star';

  @Column({ type: 'text', nullable: true })
  recommendation: string | null;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
