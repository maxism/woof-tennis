import { IsDateString } from 'class-validator';

export class GenerateSlotsDto {
  @IsDateString()
  dateFrom: string;

  @IsDateString()
  dateTo: string;
}
