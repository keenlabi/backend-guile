import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictionModel } from './infrastructure/persistence/models/prediction.model';
import { PredictionController } from './infrastructure/controllers/prediction.controller';
import { PredictionRepository } from './infrastructure/persistence/repositories/prediction.repository';
import { PlacePredictionUseCase } from './application/usecases/place-prediction.usecase';
import { ResolvePredictionUseCase } from './application/usecases/resolve-prediction.usecase';
import { WalletModule } from 'src/wallet/wallet.module';
import { MarketModule } from 'src/market/market.module';
import { TokenModule } from 'src/shared/auth/token.module';
import { GetPredictionsUseCase } from './application/usecases/get-predictions.usecase';
import { GetPendingPredictionsUseCase } from './application/usecases/get-pending-predictions.usecase';
import { ClosePredictionUseCase } from './application/usecases/close-prediction.usecase';
import { UserModule } from 'src/user/user.module'; // <--- 1. Import UserModule
import { ToggleManagedModeUseCase } from 'src/user/application/usecases/toggle-managed-mode.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([PredictionModel]),
    WalletModule,
    MarketModule,
    TokenModule,
    UserModule,
  ],
  controllers: [PredictionController],
  providers: [
    PredictionRepository,
    PlacePredictionUseCase,
    ResolvePredictionUseCase,
    GetPredictionsUseCase,
    GetPendingPredictionsUseCase,
    ClosePredictionUseCase,
    ToggleManagedModeUseCase
  ],
})
export class PredictionModule {}