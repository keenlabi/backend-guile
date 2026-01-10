import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletModel } from '../models/wallet.model';
import { IWalletRepository } from '../../../domain/repositories/wallet.repository.interface';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

@Injectable()
export class WalletRepository extends BaseRepository<Wallet, WalletModel> implements IWalletRepository {
  constructor(
    @InjectRepository(WalletModel)
    readonly repository: Repository<WalletModel>,
  ) {
    super(repository)
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const model = await this.repository.findOne({ where: { user_id: userId } });
    if (!model) return null;
    return this.toDomain(model);
  }

  async save(wallet: Wallet): Promise<Wallet> {
    const model = this.toPersistence(wallet);
    const savedModel = await this.repository.save(model);
    return this.toDomain(savedModel);
  }

  generateId(): string {
    return crypto.randomUUID();
  }

  protected toDomain(model: WalletModel): Wallet {
    return Wallet.fromPersistence(
      model.id,
      model.user_id,
      Number(model.balance),
      model.created_at,
      model.updated_at,
    );
  }

  protected toPersistence(entity: Wallet): WalletModel {
    const model = new WalletModel();
    model.id = entity.id;
    model.user_id = entity.userId;
    model.balance = entity.balance;
    return model;
  }
}