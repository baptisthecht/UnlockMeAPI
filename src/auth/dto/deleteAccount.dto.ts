import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class deleteAccountDto {
  @ApiProperty({
    example: '12345678',
    description: 'This is the user password.',
  })
  @IsNotEmpty()
  readonly password: string;
}
