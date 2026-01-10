import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import * as transactionRepositoryInterface from '../../domain/repositories/transaction.repository.interface';
import { TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

@Injectable()
export class ProcessWithdrawalUseCase {
  constructor(
    @Inject('IWalletRepository') private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
    @Inject('ITransactionRepository') private readonly transactionRepository: transactionRepositoryInterface.ITransactionRepository,
  ) {}

  async execute(transactionId: string, action: 'APPROVE' | 'REJECT', txHash?: string) {
    // 1. Find the Request
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) throw new NotFoundException('Transaction not found');

    if (transaction.type !== TransactionType.WITHDRAWAL || transaction.status !== TransactionStatus.PENDING) {
        throw new BadRequestException('Transaction is not a pending withdrawal');
    }

    if (action === 'APPROVE') {
        // --- APPROVE FLOW ---
        // Funds were already deducted. We just mark it done and add the proof (hash).
        if (!txHash) throw new BadRequestException('Transaction Hash required for approval');
        
        // Update Transaction
        // (Assuming you add a updateStatus or similar method, or re-save entity)
        // Ideally we update the entity instance then save
        const updatedTx = { ...transaction, status: TransactionStatus.COMPLETED, txHash: txHash };
        // NOTE: In a real entity pattern, use a setter or method like transaction.complete(txHash)
        // For brevity here, assuming we save the partial update or the entity
        await this.transactionRepository.save(updatedTx as any); 

        return { status: 'COMPLETED', txHash };

    } else {
        // --- REJECT FLOW ---
        // We must REFUND the money back to the user.
        const wallet = await this.walletRepository.findByUserId(transaction.userId);
        if (wallet) {
            wallet.balance = Number(wallet.balance) + Number(transaction.amountUsd);
            await this.walletRepository.save(wallet);
        }

        const updatedTx = { ...transaction, status: TransactionStatus.FAILED };
        await this.transactionRepository.save(updatedTx as any);

        return { status: 'FAILED', message: 'Funds refunded to user' };
    }
  }
}