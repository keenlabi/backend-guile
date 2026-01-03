import { Inject, Injectable } from '@nestjs/common';
import { Asset } from 'src/asset/domain/entities/asset.entity';
import * as assetRepositoryInterface from 'src/asset/domain/repositories/asset.repository.interface';

@Injectable()
export class GetAllAssetsUseCase {
  constructor(
    @Inject('IAssetRepository')
    private readonly assetRepository: assetRepositoryInterface.IAssetRepository,
  ) {}

  async execute(): Promise<Asset[]> {
    return this.assetRepository.findAll();
  }
}