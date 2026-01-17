import { Controller, Post, Body, UseGuards, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SubmitKycUseCase } from '../../application/usecases/submit-kyc.usecase';
import { SubmitKycDto } from './dtos/submit-kyc.dto';
import { kycStorageConfig } from '../../../shared/infrastructure/storage/multer-config';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';

@Controller('kyc')
export class KycController {
  constructor(private readonly submitKycUseCase: SubmitKycUseCase) {}

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
    @UploadedFiles() files: { documentFront: Express.Multer.File[], documentBack: Express.Multer.File[], selfie: Express.Multer.File[] }
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