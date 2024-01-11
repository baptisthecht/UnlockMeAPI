import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class emailConfirmationDto {
  @ApiProperty({
    example: 'jhon_doe@example.com',
    description: 'This is the user email.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    example: '884568',
    description: 'This is the OTP.',
  })
  @IsNotEmpty()
  code: string;
}
