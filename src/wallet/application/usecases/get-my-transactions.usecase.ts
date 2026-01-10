import { Inject, Injectable } from '@nestjs/common';
import * as transactionRepositoryInterface from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class GetMyTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository') 
    private readonly transactionRepository: transactionRepositoryInterface.ITransactionRepository,
  ) {}

  async execute(userId: string) {
    const transactions = await this.transactionRepository.findByUserId(userId);

    return transactions.map(tx => ({
      id: tx.id,
      type: tx.type, // 'DEPOSIT' or 'WITHDRAWAL'
      status: tx.status, // 'PENDING', 'COMPLETED', 'FAILED'
      
      amountUsd: tx.amountUsd,
      symbol: tx.symbol,
      tokenAmount: tx.tokenAmount, // e.g., 0.5 BTC
      
      // Details
      destinationAddress: tx.senderAddress, // For withdrawals
      txHash: tx.txHash,
      createdAt: tx.createdAt,
    }));
  }
}