import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class RescheduleEventDto {
  @Type(() => Date)
  @IsDate()
  startsAt: Date;

  @Type(() => Date)
  @IsDate()
  endsAt: Date;
}
