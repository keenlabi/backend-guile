import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Req, 
  UploadedFiles, 
  UseInterceptors, 
  Get 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SubmitKycUseCase } from '../../application/usecases/submit-kyc.usecase';
import { GetKycStatusUseCase } from '../../application/usecases/get-kyc-status.usecase';
import { SubmitKycDto } from './dtos/submit-kyc.dto';
import { kycStorageConfig } from '../../../shared/infrastructure/storage/multer-config';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUserPayload } from 'src/shared/types/express/auth';

@Controller('kyc')
export class KycController {
  constructor(
    private readonly submitKycUseCase: SubmitKycUseCase,
    private readonly getKycStatusUseCase: GetKycStatusUseCase
  ) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Req() req: any) {
    const user = req.user as CurrentUserPayload;
    return this.getKycStatusUseCase.execute(user.userId);
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ], kycStorageConfig))
  async submit(
    @Req() req: any,
    @Body() dto: SubmitKycDto,
    // We mark these as optional (?) because 'documentBack' might be missing for Passports
    @UploadedFiles() files: { 
      documentFront?: Express.Multer.File[], 
      documentBack?: Express.Multer.File[], 
      selfie?: Express.Multer.File[] 
    }
  ) {
    // Map the incoming file field names to what the usecase expects
    const fileMap = {
        front: files.documentFront,
        back: files.documentBack,
        selfie: files.selfie
    };

    return this.submitKycUseCase.execute(req.user.userId, dto, fileMap);
  }
}