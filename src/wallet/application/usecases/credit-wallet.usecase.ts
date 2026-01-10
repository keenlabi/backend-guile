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
    txHash?: string, 
    senderAddress?: string, 
    network?: string
  ) {
    // 1. Validate User
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // 2. Get or Create Wallet
    let wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      wallet = Wallet.create(this.walletRepository.generateId(), userId);
    }

    const cleanSymbol = symbol.toUpperCase();
    let amountToAddInUsd = 0;
    let rate = 1;

    // 3. Calculate USD Value
    if (['USD', 'USDT', 'USDC'].includes(cleanSymbol)) {
        amountToAddInUsd = amount;
    } else {
        rate = await this.cryptoRateService.getRateInUsd(cleanSymbol);
        amountToAddInUsd = amount * rate;
    }

    // 4. Update Wallet Balance (USD Only)
    wallet.balance = Number(wallet.balance) + amountToAddInUsd;
    await this.walletRepository.save(wallet);

    // 5. Create Audit Record
    // We still record that "1.5 BTC" was deposited, even though the wallet holds USD now.
    const transaction = Transaction.create(
      this.transactionRepository.generateId(),
      userId,
      TransactionType.DEPOSIT,
      cleanSymbol,
      amountToAddInUsd, // $75,000
      amount,           // 1.5 BTC
      rate,
      TransactionStatus.COMPLETED,
      txHash,
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
        newBalance: wallet.balance,
        txHash: txHash || null
      }
    };
  }
}