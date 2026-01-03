import { Inject, Injectable } from '@nestjs/common';
import * as walletRepositoryInterface from 'src/wallet/domain/repositories/wallet.repository.interface';
import { Wallet } from 'src/wallet/domain/entities/wallet.entity';

@Injectable()
export class GetMyWalletUseCase {
  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
  ) {}

  async execute(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      // Auto-create wallet for new users
      const newId = this.walletRepository.generateId();
      wallet = Wallet.create(newId, userId);
      await this.walletRepository.save(wallet);
    }

    return wallet;
  }
}