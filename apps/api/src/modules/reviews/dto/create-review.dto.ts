import {
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  bookingId: string;

  @IsUUID()
  targetId: string;

  @IsInt()
  @Min(1)
  @Max(3)
  poopRating: number;

  @IsInt()
  @Min(1)
  @Max(3)
  starRating: number;

  @IsOptional()
  @IsString()
  recommendation?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
