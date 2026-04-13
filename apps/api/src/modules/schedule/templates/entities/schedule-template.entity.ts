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
import { UserEntity } from '../../../users/entities/user.entity';
import { LocationEntity } from '../../../locations/entities/location.entity';

@Entity('schedule_templates')
@Unique('UQ_schedule_template_unique', [
  'coachId',
  'locationId',
  'dayOfWeek',
  'startTime',
])
export class ScheduleTemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_schedule_template_coach_id')
  @Column('uuid')
  coachId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'coachId' })
  coach: UserEntity;

  @Index('IDX_schedule_template_location_id')
  @Column('uuid')
  locationId: string;

  @ManyToOne(() => LocationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;

  @Column({ type: 'smallint' })
  dayOfWeek: number;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'smallint', default: 60 })
  slotDurationMinutes: number;

  @Column({ type: 'smallint', default: 1 })
  maxPlayers: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
