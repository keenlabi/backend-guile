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

    // 2. Validate Required Files (Front & Selfie are ALWAYS required)
    const frontFile = files.front?.[0];
    const selfieFile = files.selfie?.[0];

    if (!frontFile) throw new BadRequestException('Front ID document is required');
    if (!selfieFile) throw new BadRequestException('Selfie is required');

    // 3. Conditional Validation for Back File
    let backFile = files.back?.[0];
    
    if (data.documentType === 'PASSPORT') {
        // Back file is OPTIONAL for Passport
    } else {
        // Back file is REQUIRED for everything else (ID_CARD, DRIVERS_LICENSE)
        if (!backFile) {
            throw new BadRequestException(`Back of document is required for ${data.documentType}`);
        }
    }

    // 4. Prepare Paths
    const frontPath = `/uploads/kyc/${frontFile.filename}`;
    const selfiePath = `/uploads/kyc/${selfieFile.filename}`;
    
    // Handle optional back path
    const backPath = backFile ? `/uploads/kyc/${backFile.filename}` : null;

    // 5. Save to DB
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
    entity.document_back_url = backPath; // Can now be null
    entity.selfie_url = selfiePath;
    
    entity.status = KycStatus.PENDING;
    entity.rejection_reason = null; 

    await this.kycRepository.save(entity);

    return { status: 'PENDING', message: 'KYC submitted successfully' };
  }
}