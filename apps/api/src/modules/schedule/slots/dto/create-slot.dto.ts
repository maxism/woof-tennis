import { IsUUID, IsString, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CreateSlotDto {
  @IsUUID()
  locationId: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsInt()
  @Min(1)
  @Max(4)
  maxPlayers: number;
}
