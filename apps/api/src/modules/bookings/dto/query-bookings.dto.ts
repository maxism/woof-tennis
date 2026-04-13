import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { BookingStatus } from '@wooftennis/shared';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

export class QueryBookingsDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
