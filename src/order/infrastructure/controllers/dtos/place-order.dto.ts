import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsEnum(['BUY', 'SELL'])
  side: string;

  @IsNumber()
  @Min(1) // Minimum trade size $1
  @Type(() => Number)
  amountUsd: number; // This is the USD value (e.g., $100)
}