import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminWalletActionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  symbol: string; // e.g., 'BTC'

  @IsNumber()
  @Min(0.00000001)
  @Type(() => Number)
  amount: number; // e.g., 1.5 (BTC)

  // Optional: For manually recording blockchain details
  @IsOptional()
  @IsString()
  txHash?: string;

  @IsOptional()
  @IsString()
  senderAddress?: string;

  @IsOptional()
  @IsString()
  network?: string;
}