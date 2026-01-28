import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycRecordModel } from '../../infrastructure/persistence/models/kyc.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetKycStatusUseCase {
  constructor(
    @InjectRepository(KycRecordModel)
    private readonly kycRepository: Repository<KycRecordModel>,
    private readonly configService: ConfigService,
  ) {}

  async execute(userId: string) {
    const kyc = await this.kycRepository.findOne({ 
        where: { user_id: userId }
    });

    if (!kyc) {
      return { 
          status: 'NOT_SUBMITTED', 
          rejectionReason: null 
      };
    }

    const port = this.configService.get('PORT') || 3000;
    const baseUrl = this.configService.get('API_URL') || `http://localhost:${port}`;

    return {
      status: kyc.status,
      rejectionReason: kyc.rejection_reason,
      // Return full URLs so the frontend can preview what was uploaded
      documents: {
          front: this.toFullUrl(baseUrl, kyc.document_front_url),
          back: this.toFullUrl(baseUrl, kyc.document_back_url),
          selfie: this.toFullUrl(baseUrl, kyc.selfie_url),
      }
    };
  }

  private toFullUrl(baseUrl: string, path: string | null): string | null {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      return `${baseUrl}${path}`;
  }
}