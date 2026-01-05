import { Inject, Injectable } from '@nestjs/common';
import * as walletRepositoryInterface from 'src/wallet/domain/repositories/wallet.repository.interface';
import { GetMyWalletUseCase } from './get-my-wallet.usecase';
import { Wallet } from 'src/wallet/domain/entities/wallet.entity';

@Injectable()
export class DepositFundsUseCase {
  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
    private readonly getMyWalletUseCase: GetMyWalletUseCase,
  ) {}

  async execute(userId: string, amount: number) {
     await this.getMyWalletUseCase.execute(userId);
    
    // wallet.deposit(amount);
    
    // return await this.walletRepository.save(wallet);
  }
}