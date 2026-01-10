import { Inject, Injectable } from '@nestjs/common';
import * as transactionRepositoryInterface from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class GetPendingWithdrawalsUseCase {
  constructor(
    @Inject('ITransactionRepository') private readonly transactionRepository: transactionRepositoryInterface.ITransactionRepository,
  ) {}

  async execute() {
    return this.transactionRepository.findPendingWithdrawals();
  }
}