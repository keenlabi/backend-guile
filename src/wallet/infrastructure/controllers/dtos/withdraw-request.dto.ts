import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class WithdrawRequestDto {
  @IsString()
  @IsNotEmpty()
  symbol: string; // e.g. "BTC"

  @IsNumber()
  @Min(1) // Minimum withdrawal $1
  amountUsd: number;

  @IsString()
  @IsNotEmpty()
  destinationAddress: string;
}