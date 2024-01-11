import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class resetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'jhon_doe@example.com',
    description: 'This is the user email.',
  })
  @IsEmail()
  readonly email: string;
}
