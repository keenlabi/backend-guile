import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycRecordModel, KycStatus } from '../../infrastructure/persistence/models/kyc.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetPendingKycUseCase {
  constructor(
    @InjectRepository(KycRecordModel)
    private readonly kycRepository: Repository<KycRecordModel>,
    private readonly configService: ConfigService,
  ) {}

  async execute() {
    const records = await this.kycRepository.find({
      where: { status: KycStatus.PENDING },
      order: { created_at: 'DESC' },
      relations: ['user'], 
    });

    // Generate Base URL (e.g., http://localhost:6110)
    const port = this.configService.get('PORT') || 3000;
    const baseUrl = this.configService.get('API_URL') || `http://localhost:${port}`; 

    // Transform relative paths to absolute URLs
    return records.map(record => ({
        ...record,
        document_front_url: this.toFullUrl(baseUrl, record.document_front_url),
        document_back_url: this.toFullUrl(baseUrl, record.document_back_url),
        selfie_url: this.toFullUrl(baseUrl, record.selfie_url),
    }));
  }

  private toFullUrl(baseUrl: string, path: string | null): string | null {
      if (!path) return null;
      if (path.startsWith('http')) return path; // Already absolute
      return `${baseUrl}${path}`;
  }
}