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

  @IsString()
  @MaxLength(3000)
  description: string;

  @IsString()
  @MaxLength(500)
  website: string;
}
