import { IsOptional, IsString, IsInt, Min, Max, IsBoolean, IsIn } from 'class-validator';
import { ALLOWED_SLOT_DURATIONS } from '@wooftennis/shared';

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  @IsIn([...ALLOWED_SLOT_DURATIONS])
  slotDurationMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  maxPlayers?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
