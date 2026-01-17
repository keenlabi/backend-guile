import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycRecordModel, KycStatus } from '../../infrastructure/persistence/models/kyc.model';
import * as profileRepositoryInterface from '../../domain/repositories/profile.repository.interface';

@Injectable()
export class ReviewKycUseCase {
  constructor(
    @InjectRepository(KycRecordModel)
    private readonly kycRepository: Repository<KycRecordModel>,
    @Inject('IProfileRepository')
    private readonly profileRepository: profileRepositoryInterface.IProfileRepository,
  ) {}

  async execute(kycId: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string) {
    const kyc = await this.kycRepository.findOne({ where: { id: kycId } });
    if (!kyc) throw new NotFoundException('KYC record not found');

    if (kyc.status !== KycStatus.PENDING) {
      throw new BadRequestException('KYC is already resolved');
    }

    if (action === 'REJECT') {
      kyc.status = KycStatus.REJECTED;
      kyc.rejection_reason = rejectionReason || 'Documents rejected by admin';
      await this.kycRepository.save(kyc);
      return { status: 'REJECTED' };
    }

    // --- APPROVAL LOGIC ---
    kyc.status = KycStatus.APPROVED;
    await this.kycRepository.save(kyc);

    // SYNC TO PROFILE (The "Verified" Name)
    const profile = await this.profileRepository.findByUserId(kyc.user_id);
    if (profile) {
      // We explicitly cast properties because the Profile domain entity might be readonly
      // In a real Domain setup, you'd use a method like `profile.updateDetails(...)`
      (profile as any).firstName = kyc.first_name;
      (profile as any).lastName = kyc.last_name;
      
      await this.profileRepository.save(profile);
    }

    return { status: 'APPROVED' };
  }
}