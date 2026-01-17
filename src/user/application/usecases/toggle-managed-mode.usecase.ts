import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as profileRepositoryInterface from '../../domain/repositories/profile.repository.interface';
import * as walletRepositoryInterface from 'src/wallet/domain/repositories/wallet.repository.interface';

@Injectable()
export class ToggleManagedModeUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: profileRepositoryInterface.IProfileRepository,
    @Inject('IWalletRepository')
    private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
  ) {}

  async execute(userId: string, enable: boolean) {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    if (enable) {
        const wallet = await this.walletRepository.findByUserId(userId);
        if (!wallet) throw new NotFoundException('Wallet not found');

        // Check if balance is greater than 10
        if (Number(wallet.balance) <= 10) {
            throw new BadRequestException('Insufficient balance. You need more than $10 to enable AI trading.');
        }
    }

    // We need to add a setter or update method to your Domain Entity ideally,
    // but for now we reconstruct or update the model mapping.
    // Assuming your repository 'save' handles updates:
    (profile as any).isManaged = enable; 
    await this.profileRepository.save(profile);
    
    return { 
        userId, 
        isManaged: enable, 
        message: enable ? 'AI Trading Enabled. Manual trading disabled.' : 'Manual trading restored.' 
    };
  }
}