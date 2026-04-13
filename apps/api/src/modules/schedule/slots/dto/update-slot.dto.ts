import { IsOptional, IsString, IsEnum } from 'class-validator';
import { SlotStatus } from '@wooftennis/shared';

export class UpdateSlotDto {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsEnum(SlotStatus)
  status?: SlotStatus;
}
