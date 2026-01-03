import { IsNumber, Min } from 'class-validator';

export class DepositRequestDto {
  @IsNumber()
  @Min(1)
  amount: number;
}