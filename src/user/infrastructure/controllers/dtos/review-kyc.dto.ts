import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ReviewKycDto {
  @IsEnum(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsString()
  reason?: string;
}