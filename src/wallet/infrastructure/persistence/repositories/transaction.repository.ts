import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionModel } from '../models/transaction.model';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction, TransactionModel> implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionModel)
    readonly repository: Repository<TransactionModel>,
  ) {
    super(repository);
  }

  protected toDomain(model: TransactionModel): Transaction {
    return new Transaction(
      model.id,
      model.user_id,
      model.type as 'CREDIT' | 'DEBIT',
      model.symbol,
      Number(model.amount_usd),
      Number(model.token_amount),
      Number(model.rate_at_time),
      model.created_at,
    );
  }

  protected toPersistence(entity: Transaction): TransactionModel {
    const model = new TransactionModel();
    model.id = entity.id;
    model.user_id = entity.userId;
    model.type = entity.type;
    model.symbol = entity.symbol;
    model.amount_usd = entity.amountUsd;
    model.token_amount = entity.tokenAmount;
    model.rate_at_time = entity.rateAtTime;
    return model;
  }
}