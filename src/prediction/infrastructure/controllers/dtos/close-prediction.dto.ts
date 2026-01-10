import { IsNumber, Min } from 'class-validator';

export class ClosePredictionDto {
  @IsNumber()
  @Min(0)
  closePrice: number;
}