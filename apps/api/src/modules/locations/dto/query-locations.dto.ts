import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryLocationsDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}

