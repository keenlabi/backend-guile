import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './infrastructure/controllers/wallet.controller';
import { WalletModel } from './infrastructure/persistence/models/wallet.model';
import { WalletRepository } from './infrastructure/persistence/repositories/wallet.repository';
import { GetMyWalletUseCase } from './application/usecases/get-my-wallet.usecase';
import { DepositFundsUseCase } from './application/usecases/deposit-funds.usecase';
import { TokenModule } from 'src/shared/auth/token.module';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WalletModel
    ]),
    TokenModule,
    AssetModule
  ],
  controllers: [WalletController],
  providers: [
    GetMyWalletUseCase,
    DepositFundsUseCase,
    {
      provide: 'IWalletRepository',
      useClass: WalletRepository,
    },
  ],
  exports: ['IWalletRepository'],
})
export class WalletModule {}