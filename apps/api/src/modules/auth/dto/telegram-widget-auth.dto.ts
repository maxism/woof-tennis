import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class TelegramWidgetAuthDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsInt()
  auth_date: number;

  @IsString()
  @IsNotEmpty()
  hash: string;
}
