import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'jhon_doe@example.com',
    description: 'This is the user email.',
  })
  @IsEmail()
  readonly email: string;
  @ApiProperty({
    example: '12345678',
    description: 'This is the user password.',
  })
  @IsNotEmpty()
  readonly password: string;
}
