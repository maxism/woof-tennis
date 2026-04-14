import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, Matches } from 'class-validator';

export class CreateEventInviteDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @Matches(/^@?[A-Za-z0-9_]+$/, {
    each: true,
    message: 'targets должны содержать TG username с символами A-Z, 0-9 и "_"',
  })
  targets: string[];
}
