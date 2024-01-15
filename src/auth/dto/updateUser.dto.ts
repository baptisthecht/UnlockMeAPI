import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  displayName: string;
  @IsNotEmpty()
  bio: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
