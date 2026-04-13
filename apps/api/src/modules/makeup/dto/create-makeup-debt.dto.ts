import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateMakeupDebtDto {
  @IsUUID()
  playerId: string;

  @IsUUID()
  originalBookingId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
