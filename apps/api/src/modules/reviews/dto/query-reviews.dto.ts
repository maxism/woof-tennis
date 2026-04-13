import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

export class QueryReviewsDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  targetId?: string;

  @IsOptional()
  @IsUUID()
  reviewerId?: string;
}
