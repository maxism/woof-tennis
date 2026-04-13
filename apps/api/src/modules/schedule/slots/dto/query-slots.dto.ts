import { IsUUID, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { SlotStatus } from '@wooftennis/shared';

export class QuerySlotsDto {
  @IsUUID()
  coachId: string;

  @IsOptional()
  @IsUUID()
  locationId?: string;

  @IsDateString()
  dateFrom: string;

  @IsDateString()
  dateTo: string;

  @IsOptional()
  @IsEnum(SlotStatus)
  status?: SlotStatus;
}
