import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';

export class ResolvePredictionDto {
  @IsEnum(['WIN', 'LOSS'])
  outcome: 'WIN' | 'LOSS';

  // @IsNumber()
  // @Type(()=> Number)
  // openPrice: number;
  
  // @IsNumber()
  // @Type(()=> Number)
  // closePrice: number;

  @IsNumber()
  @Type(()=> Number)
  payout: number;
}