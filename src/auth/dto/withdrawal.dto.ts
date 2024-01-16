import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class WithdrawalDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  rib: string;
}
