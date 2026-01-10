import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';

export class SubmitKycDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsDateString() dob: string;
  @IsString() @IsNotEmpty() country: string;
  @IsEnum(['PASSPORT', 'DRIVERS_LICENSE', 'ID_CARD']) documentType: string;
  
  // Note: Files are handled separately by the FileInterceptor, not in the JSON body
}