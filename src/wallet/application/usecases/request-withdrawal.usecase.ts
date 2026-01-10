import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import * as transactionRepositoryInterface from '../../domain/repositories/transaction.repository.interface';
import { CryptoRateService } from '../../infrastructure/services/crypto-rate.service';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

@Injectable()
export class RequestWithdrawalUseCase {
  constructor(
    @Inject('IWalletRepository') private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
    @Inject('ITransactionRepository') private readonly transactionRepository: transactionRepositoryInterface.ITransactionRepository,
    private readonly cryptoRateService: CryptoRateService,
  ) {}

  async execute(userId: string, symbol: string, amountUsd: number, destinationAddress: string) {
    const cleanSymbol = symbol.toUpperCase();

    // 1. Get Wallet
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    // 2. SAFETY CHECK: Ensure Balance covers the request
    if (Number(wallet.balance) < amountUsd) {
        throw new BadRequestException(`Insufficient USD balance. Available: $${wallet.balance}`);
    }

    // 3. Calculate Estimated Crypto (Informational only)
    let rate = 1;
    let estimatedTokenAmount = 0;
    
    // If withdrawing crypto, fetch rate
    if (!['USD', 'USDT', 'USDC'].includes(cleanSymbol)) {
        rate = await this.cryptoRateService.getRateInUsd(cleanSymbol);
        if (rate > 0) estimatedTokenAmount = amountUsd / rate;
    } else {
        estimatedTokenAmount = amountUsd;
    }

    // 4. CRITICAL: DEDUCT BALANCE NOW
    // We lock the funds by removing them. If the Admin rejects later, we refund.
    wallet.balance = Number(wallet.balance) - amountUsd;
    await this.walletRepository.save(wallet);

    // 5. Create PENDING Transaction
    const transaction = Transaction.create(
      this.transactionRepository.generateId(),
      userId,
      TransactionType.WITHDRAWAL,
      cleanSymbol,
      amountUsd,
      estimatedTokenAmount,
      rate,
      TransactionStatus.PENDING, // <--- Waiting for Admin
      undefined,
      destinationAddress, // Where they want the money
      cleanSymbol
    );

    await this.transactionRepository.save(transaction);

    return {
      success: true,
      message: 'Withdrawal requested. Funds reserved.',
      data: {
        id: transaction.id,
        amountUsd,
        status: 'PENDING',
        newBalance: wallet.balance
      }
    };
  }
}