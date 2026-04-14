import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class SearchUserByUsernameDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 32)
  @Matches(/^@?[A-Za-z0-9_]+$/, {
    message:
      'username должен содержать только буквы, цифры, "_" и опциональный "@" в начале',
  })
  username: string;
}

