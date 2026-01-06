import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModel } from './infrastructure/persistence/models/asset.model';
import { AssetController } from './infrastructure/controllers/asset.controller';
import { AssetRepository } from './infrastructure/persistence/repositories/asset.repository';
import { GetAllAssetsUseCase } from './application/usecases/get-all-assets.usecase';
import { MarketController } from './infrastructure/controllers/market.controller';
import { WalletModule } from 'src/wallet/wallet.module';
import { GetAssetChartUseCase } from './application/usecases/get-asset-chart.usecase';
import { MarketModule } from 'src/market/market.module';

@Module({
  imports: [TypeOrmModule.forFeature([AssetModel]), MarketModule],
  controllers: [AssetController, MarketController],
  providers: [
    GetAllAssetsUseCase,
    GetAssetChartUseCase,

    {
      provide: 'IAssetRepository',
      useClass: AssetRepository,
    },
  ],
  exports: ['IAssetRepository'],
})

export class AssetModule {}