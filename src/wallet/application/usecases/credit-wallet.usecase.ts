import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import * as transactionRepositoryInterface from '../../domain/repositories/transaction.repository.interface';
import { CryptoRateService } from '../../infrastructure/services/crypto-rate.service';
import { Transaction } from '../../domain/entities/transaction.entity';
import { Wallet } from '../../domain/entities/wallet.entity';
import * as userRepositoryInterface from 'src/user/domain/repositories/user.repository.interface';

@Injectable()
export class CreditWalletUseCase {
  constructor(
    @Inject('IWalletRepository') private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
    @Inject('ITransactionRepository') private readonly transactionRepository: transactionRepositoryInterface.ITransactionRepository,
    @Inject('IUserRepository') private readonly userRepository: userRepositoryInterface.IUserRepository,
    private readonly cryptoRateService: CryptoRateService,
  ) {}

  async execute(userId: string, symbol: string, amountUsd: number) {
    // 1. Validate User
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // 2. Get Wallet (Create if missing - similar logic to GetMyWallet)
    let wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      // Create empty wallet if it doesn't exist
      wallet = Wallet.create(this.walletRepository.generateId(), userId, {});
    }

    // 3. Get Rate and Calculate Tokens
    const rate = await this.cryptoRateService.getRateInUsd(symbol);
    const tokenAmount = amountUsd / rate;

    // 4. Update Wallet Balance
    const currentAsset = wallet.assets[symbol] || { balance: 0 };
    const newBalance = Number(currentAsset.balance) + tokenAmount;

    // We must re-assign the object for TypeORM to detect the JSONB change
    wallet.assets = {
      ...wallet.assets,
      [symbol]: { balance: newBalance },
    };

    await this.walletRepository.save(wallet);

    // 5. Create Audit Record
    const transaction = Transaction.create(
      this.transactionRepository.generateId(),
      userId,
      'CREDIT',
      symbol,
      amountUsd,
      tokenAmount,
      rate,
    );

    await this.transactionRepository.save(transaction);

    return {
      success: true,
      data: {
        symbol,
        creditedAmount: tokenAmount,
        newBalance,
        rateUsed: rate
      }
    };
  }
}