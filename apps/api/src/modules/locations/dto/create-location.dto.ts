import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  address: string;
}
