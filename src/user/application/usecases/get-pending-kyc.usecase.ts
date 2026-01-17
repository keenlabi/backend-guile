import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycRecordModel, KycStatus } from '../../infrastructure/persistence/models/kyc.model';

@Injectable()
export class GetPendingKycUseCase {
  constructor(
    @InjectRepository(KycRecordModel)
    private readonly kycRepository: Repository<KycRecordModel>,
  ) {}

  async execute() {
    return await this.kycRepository.find({
      where: { status: KycStatus.PENDING },
      order: { created_at: 'DESC' },
      relations: ['user'], // Include user email/details
    });
  }
}