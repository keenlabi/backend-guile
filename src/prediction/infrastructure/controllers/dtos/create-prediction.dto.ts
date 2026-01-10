import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class CreatePredictionDto {
  @IsString()
  symbol: string;

  @IsEnum(['HIGH', 'LOW'])
  direction: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  duration: number; // Seconds
}