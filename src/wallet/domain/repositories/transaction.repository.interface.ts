import { Transaction } from '../entities/transaction.entity';
import { IBaseRepository } from 'src/shared/domain/repositories/base.repository.interface';

export interface ITransactionRepository extends IBaseRepository<Transaction> {
  // Add specific query methods here if needed in the future
}