import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import * as transactionRepositoryInterface from '../../domain/repositories/transaction.repository.interface';
import { CryptoRateService } from '../../infrastructure/services/crypto-rate.service';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class DebitWalletUseCase {
  constructor(
    @Inject('IWalletRepository') private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
    @Inject('ITransactionRepository') private readonly transactionRepository: transactionRepositoryInterface.ITransactionRepository,
    private readonly cryptoRateService: CryptoRateService,
  ) {}

  async execute(userId: string, symbol: string, amountUsd: number) {
    console.log(userId)
    // 1. Get Wallet
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found for this user');

    // 2. Get Rate and Calculate Tokens to remove
    const rate = await this.cryptoRateService.getRateInUsd(symbol);
    const tokenAmountToRemove = amountUsd / rate;

    // 3. Check Balance
    const currentAsset = wallet.assets[symbol];
    if (!currentAsset || currentAsset.balance < tokenAmountToRemove) {
      throw new BadRequestException(`Insufficient ${symbol} balance. Required: ${tokenAmountToRemove}, Available: ${currentAsset?.balance || 0}`);
    }

    // 4. Update Wallet
    const newBalance = Number(currentAsset.balance) - tokenAmountToRemove;
    wallet.assets = {
      ...wallet.assets,
      [symbol]: { balance: newBalance },
    };

    await this.walletRepository.save(wallet);

    // 5. Create Audit Record
    const transaction = Transaction.create(
      this.transactionRepository.generateId(),
      userId,
      'DEBIT',
      symbol,
      amountUsd,
      tokenAmountToRemove,
      rate,
    );
    await this.transactionRepository.save(transaction);

    return {
      success: true,
      data: {
        symbol,
        debitedAmount: tokenAmountToRemove,
        newBalance,
        rateUsed: rate
      }
    };
  }
}