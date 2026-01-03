import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModel } from './infrastructure/persistence/models/asset.model';
import { AssetController } from './infrastructure/controllers/asset.controller';
import { AssetRepository } from './infrastructure/persistence/repositories/asset.repository';
import { GetAllAssetsUseCase } from './application/usecases/get-all-assets.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([AssetModel])],
  controllers: [AssetController],
  providers: [
    GetAllAssetsUseCase,
    {
      provide: 'IAssetRepository',
      useClass: AssetRepository,
    },
  ],
  exports: ['IAssetRepository'],
})
export class AssetsModule {}