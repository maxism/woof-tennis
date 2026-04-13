import {
  IsString,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreatePlaySessionDto {
  @IsString()
  @MaxLength(500)
  locationText: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsInt()
  @Min(2)
  @Max(10)
  maxPlayers: number;
}
