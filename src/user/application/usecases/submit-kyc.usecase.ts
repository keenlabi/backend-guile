import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { KycRecordModel, KycStatus } from '../../infrastructure/persistence/models/kyc.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SubmitKycUseCase {
  constructor(
    @InjectRepository(KycRecordModel)
    private readonly kycRepository: Repository<KycRecordModel>,
  ) {}

  async execute(
    userId: string, 
    data: any, 
    files: { front?: Express.Multer.File[], back?: Express.Multer.File[], selfie?: Express.Multer.File[] }
  ) {
    // 1. Check if user already submitted
    const existing = await this.kycRepository.findOne({ where: { user_id: userId } });
    if (existing && existing.status !== KycStatus.REJECTED) {
      throw new BadRequestException('KYC already submitted or approved');
    }

    // 2. Validate Files
    const frontFile = files.front?.[0];
    if (!frontFile) throw new BadRequestException('Front ID document is required');

    // 3. Prepare Paths
    const frontPath = `/uploads/kyc/${frontFile.filename}`;
    const backPath = files.back?.[0] ? `/uploads/kyc/${files.back[0].filename}` : null;
    const selfiePath = files.selfie?.[0] ? `/uploads/kyc/${files.selfie[0].filename}` : null;

    // 4. Save to DB
    // If rejected previously, we update the existing record, otherwise create new
    const entity = existing || new KycRecordModel();
    
    if (!existing) {
        entity.id = uuidv4();
        entity.user_id = userId;
    }

    entity.first_name = data.firstName;
    entity.last_name = data.lastName;
    entity.dob = data.dob;
    entity.country = data.country;
    entity.document_type = data.documentType;
    
    entity.document_front_url = frontPath;
    entity.document_back_url = backPath;
    entity.selfie_url = selfiePath;
    
    entity.status = KycStatus.PENDING;
    entity.rejection_reason = null; // Reset rejection if resubmitting

    await this.kycRepository.save(entity);

    return { status: 'PENDING', message: 'KYC submitted successfully' };
  }
}