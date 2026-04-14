import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class CreateEventDto {
  @IsUUID('4')
  locationId: string;

  @Type(() => Date)
  @IsDate()
  startsAt: Date;

  @Type(() => Date)
  @IsDate()
  endsAt: Date;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  recurrence?: null;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}
