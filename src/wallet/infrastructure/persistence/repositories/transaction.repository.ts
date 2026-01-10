import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionModel } from '../models/transaction.model';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';
import { Transaction, TransactionStatus, TransactionType } from '../../../domain/entities/transaction.entity';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction, TransactionModel> implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionModel)
    readonly repository: Repository<TransactionModel>,
  ) {
    super(repository);
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const models = await this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' }
    });
    return models.map(this.toDomain);
  }

  async findPendingWithdrawals(): Promise<Transaction[]> {
    const models = await this.repository.find({
      where: {
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
      },
      order: { created_at: 'DESC' },
      relations: ['user'], // We load the User relationship here so the Admin knows who to pay
    });

    return models.map(this.toDomain);
  }

protected toDomain(model: TransactionModel): Transaction {
    return new Transaction(
      model.id,
      model.user_id,
      model.type, // Enum handles mapping automatically if types match
      model.symbol,
      Number(model.amount_usd),
      Number(model.token_amount),
      Number(model.rate_at_time),
      model.status,
      model.tx_hash,
      model.sender_address,
      model.network,
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
    model.status = entity.status;
    model.tx_hash = entity.txHash || "";
    model.sender_address = entity.senderAddress || "";
    model.network = entity.network || "";
    return model;
  }
}