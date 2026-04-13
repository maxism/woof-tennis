import {
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  bookingId: string;

  @IsUUID()
  targetId: string;

  @IsInt()
  @Min(1)
  @Max(3)
  ratingValue: number;

  @IsString()
  @IsIn(['poop', 'star'])
  ratingStyle: 'poop' | 'star';

  @IsOptional()
  @IsString()
  recommendation?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
