import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { WalletController } from './infrastructure/controllers/wallet.controller';
import { WalletModel } from './infrastructure/persistence/models/wallet.model';
import { WalletRepository } from './infrastructure/persistence/repositories/wallet.repository';
import { GetMyWalletUseCase } from './application/usecases/get-my-wallet.usecase';
import { DepositFundsUseCase } from './application/usecases/deposit-funds.usecase';
import { TokenModule } from 'src/shared/auth/token.module';
import { AssetModule } from 'src/asset/asset.module';
import { UserModule } from 'src/user/user.module';
import { TransactionModel } from './infrastructure/persistence/models/transaction.model';
import { CreditWalletUseCase } from './application/usecases/credit-wallet.usecase';
import { DebitWalletUseCase } from './application/usecases/debit-wallet.usecase';
import { CryptoRateService } from './infrastructure/services/crypto-rate.service';
import { TransactionRepository } from './infrastructure/persistence/repositories/transaction.repository';
import { MarketModule } from 'src/market/market.module';
import { GetPendingWithdrawalsUseCase } from './application/usecases/get-pending-withdrawals.usecase';
import { ProcessWithdrawalUseCase } from './application/usecases/process-withdrawal.usecase';
import { GetMyTransactionsUseCase } from './application/usecases/get-my-transactions.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WalletModel,
      TransactionModel
    ]),
    CacheModule.register({ 
      ttl: 10 * 60 * 1000,
      max: 100,
    }),
    
    TokenModule,
    AssetModule,
    UserModule,
    MarketModule,
  ],
  controllers: [WalletController],
  providers: [
    GetMyWalletUseCase,
    DepositFundsUseCase,
    CreditWalletUseCase,
    DebitWalletUseCase,
    GetPendingWithdrawalsUseCase,
    ProcessWithdrawalUseCase,
    GetMyTransactionsUseCase,

    {
      provide: 'IWalletRepository',
      useClass: WalletRepository,
    },
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
  ],
  exports: ['IWalletRepository'],
})
export class WalletModule {}