import { IsOptional, IsDateString } from 'class-validator';

export class QueryPlaySessionsDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
