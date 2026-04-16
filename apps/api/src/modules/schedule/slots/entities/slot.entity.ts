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
import { SlotStatus, SlotSource } from '@wooftennis/shared';
import { UserEntity } from '../../../users/entities/user.entity';
import { LocationEntity } from '../../../locations/entities/location.entity';
import { ScheduleTemplateEntity } from '../../templates/entities/schedule-template.entity';

@Entity('slots')
@Unique('UQ_slot_no_overlap', ['coachId', 'date', 'startTime'])
export class SlotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_slot_coach_date')
  @Column('uuid')
  coachId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'coachId' })
  coach: UserEntity;

  @Index('IDX_slot_location_date')
  @Column('uuid')
  locationId: string;

  @ManyToOne(() => LocationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;

  @Column({ type: 'uuid', nullable: true })
  templateId: string | null;

  @ManyToOne(() => ScheduleTemplateEntity, { nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: ScheduleTemplateEntity | null;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'smallint', default: 1 })
  maxPlayers: number;

  @Column({
    type: 'enum',
    enum: SlotStatus,
    default: SlotStatus.Available,
  })
  status: SlotStatus;

  @Column({
    type: 'enum',
    enum: SlotSource,
  })
  source: SlotSource;

  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
