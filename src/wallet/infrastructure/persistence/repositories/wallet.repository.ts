import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';
import { Wallet } from 'src/wallet/domain/entities/wallet.entity';
import { IWalletRepository } from 'src/wallet/domain/repositories/wallet.repository.interface';
import { WalletModel } from '../models/wallet.model';

@Injectable()
export class WalletRepository
  extends BaseRepository<Wallet, WalletModel>
  implements IWalletRepository
{
  constructor(
    @InjectRepository(WalletModel)
    private readonly walletRepo: Repository<WalletModel>,
  ) {
    super(walletRepo);
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const model = await this.walletRepo.findOne({ where: { user_id: userId } });
    if (!model) return null;
    return this.toDomain(model);
  }

  async save(entity: Wallet): Promise<Wallet> {
    const model = this.toPersistence(entity);
    const saved = await this.walletRepo.save(model);
    return this.toDomain(saved);
  }

  protected toDomain(model: WalletModel): Wallet {
    return Wallet.fromPersistence(
      model.id,
      model.user_id,
      Number(model.balance), // Ensure decimal comes back as number
      model.assets,
      model.created_at,
      model.updated_at,
    );
  }

  protected toPersistence(entity: Wallet): WalletModel {
    const model = new WalletModel();
    model.id = entity.id;
    model.user_id = entity.userId;
    model.balance = entity.balance;
    model.assets = entity.assets;
    // TypeORM handles created_at/updated_at automatically if left undefined on create
    return model;
  }
}