import { Transaction } from '../entities/transaction.entity';
import { IBaseRepository } from 'src/shared/domain/repositories/base.repository.interface';

export interface ITransactionRepository extends IBaseRepository<Transaction> {
  // Specific method ensures the UseCase doesn't need to know about "relations" or DB columns
  findPendingWithdrawals(): Promise<Transaction[]>;
  findByUserId(userId: string): Promise<Transaction[]>;
}