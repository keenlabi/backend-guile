import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import * as transactionRepositoryInterface from '../../domain/repositories/transaction.repository.interface';
import { CryptoRateService } from '../../infrastructure/services/crypto-rate.service';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
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

  async execute(
    userId: string, 
    symbol: string, 
    amount: number, // Token Amount (e.g. 1.5 BTC)
    // Optional "Evidence" to make it look real
    txHash?: string, 
    senderAddress?: string, 
    network?: string
  ) {
    // 1. Validate User & Wallet
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    let wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      wallet = Wallet.create(this.walletRepository.generateId(), userId);
    }

    const cleanSymbol = symbol.toUpperCase();
    let amountToAddInUsd = 0;
    let rate = 1;

    // 2. Calculate USD Value (Auto-Liquidation)
    if (['USD', 'USDT', 'USDC'].includes(cleanSymbol)) {
        amountToAddInUsd = amount;
    } else {
        rate = await this.cryptoRateService.getRateInUsd(cleanSymbol);
        amountToAddInUsd = amount * rate;
    }

    // 3. Update Balance (Always USD)
    wallet.balance = Number(wallet.balance) + amountToAddInUsd;
    await this.walletRepository.save(wallet);

    // 4. Create "DEPOSIT" Record
    // This looks exactly like a blockchain event to the user
    const transaction = Transaction.create(
      this.transactionRepository.generateId(),
      userId,
      TransactionType.DEPOSIT, // <--- The key: It says "DEPOSIT"
      cleanSymbol,
      amountToAddInUsd,
      amount,
      rate,
      TransactionStatus.COMPLETED,
      txHash,        // If admin provides this, it looks 100% real
      senderAddress,
      network
    );

    await this.transactionRepository.save(transaction);

    return {
      success: true,
      data: {
        type: 'DEPOSIT',
        symbol: cleanSymbol,
        amount: amount,
        valueUsd: amountToAddInUsd,
        txHash: txHash || null
      }
    };
  }
}