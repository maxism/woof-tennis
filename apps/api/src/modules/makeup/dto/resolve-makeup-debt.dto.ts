import { IsUUID } from 'class-validator';

export class ResolveMakeupDebtDto {
  @IsUUID()
  makeupBookingId: string;
}
