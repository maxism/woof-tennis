import { IsUUID } from 'class-validator';

export class AttachPlayerDto {
  @IsUUID('4')
  playerId: string;
}
