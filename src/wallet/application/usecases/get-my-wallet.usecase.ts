import { Inject, Injectable } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import { Wallet } from '../../domain/entities/wallet.entity';

@Injectable()
export class GetMyWalletUseCase {
  constructor(
    @Inject('IWalletRepository') private readonly walletRepo: walletRepositoryInterface.IWalletRepository,
  ) {}

  async execute(userId: string) {
    let wallet = await this.walletRepo.findByUserId(userId);

    // Auto-create if missing (Safe fallback)
    if (!wallet) {
      wallet = Wallet.create(this.walletRepo.generateId(), userId);
      await this.walletRepo.save(wallet);
    }

    return {
      id: wallet.id,
      usdBalance: Number(wallet.balance),
    };
  }
}