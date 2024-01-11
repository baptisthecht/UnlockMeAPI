import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class resendEmailConfirmationDto {
  @ApiProperty({
    example: 'jhon_doe@example.com',
    description: 'This is the user email.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
