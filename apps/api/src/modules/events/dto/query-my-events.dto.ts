import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum EventRoleQuery {
  Player = 'player',
  Coach = 'coach',
}

export class QueryMyEventsDto {
  @IsEnum(EventRoleQuery)
  role: EventRoleQuery;

  @Type(() => Date)
  @IsDate()
  dateFrom: Date;

  @Type(() => Date)
  @IsDate()
  dateTo: Date;

  @IsOptional()
  @IsUUID('4')
  locationId?: string;
}
