import { IBaseRepository } from 'src/shared/domain/repositories/base.repository.interface';
import { Wallet } from '../entities/wallet.entity';

export interface IWalletRepository extends IBaseRepository<Wallet> {
  findByUserId(userId: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<Wallet>;
}