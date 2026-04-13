import {
  IsUUID,
  IsInt,
  Min,
  Max,
  IsString,
  IsIn,
} from 'class-validator';
import { ALLOWED_SLOT_DURATIONS } from '@wooftennis/shared';

export class CreateTemplateDto {
  @IsUUID()
  locationId: string;

  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsInt()
  @IsIn([...ALLOWED_SLOT_DURATIONS])
  slotDurationMinutes: number;

  @IsInt()
  @Min(1)
  @Max(4)
  maxPlayers: number;
}
