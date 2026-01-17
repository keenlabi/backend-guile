import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PredictionRepository } from '../../infrastructure/persistence/repositories/prediction.repository';
import * as walletRepositoryInterface from 'src/wallet/domain/repositories/wallet.repository.interface';
import { CryptoRateService } from 'src/wallet/infrastructure/services/crypto-rate.service';
import { Prediction, PredictionDirection } from '../../domain/entities/prediction.entity';
import * as profileRepositoryInterface from 'src/user/domain/repositories/profile.repository.interface';

@Injectable()
export class PlacePredictionUseCase {
  constructor(
    private readonly predictionRepository: PredictionRepository,
    @Inject('IWalletRepository') private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
    private readonly cryptoRateService: CryptoRateService,
    @Inject('IProfileRepository') 
    private readonly profileRepository: profileRepositoryInterface.IProfileRepository,
  ) {}

  async execute(userId: string, symbol: string, direction: string, amount: number, durationSeconds: number, isSystemOverride = false) {
    if (!isSystemOverride) {
        const profile = await this.profileRepository.findByUserId(userId);
        if (profile && profile.isManaged) {
            throw new BadRequestException('Account is under AI management. Manual trading is disabled.');
        }
    }

    const cleanSymbol = symbol.toUpperCase();
    
    // 1. Check Balance
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');
    
    if (Number(wallet.balance) < amount) {
        throw new BadRequestException('Insufficient USD balance');
    }

    // 2. Get Real-time Open Price (System of Record)
    const openPrice = await this.cryptoRateService.getRateInUsd(cleanSymbol);
    if (!openPrice) throw new BadRequestException('Asset price unavailable');

    // 3. Debit Investment (Lock Funds)
    wallet.balance = Number(wallet.balance) - amount;
    await this.walletRepository.save(wallet);

    // 4. CALCULATE EXPIRATION
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (durationSeconds * 1000));

    // 5. Create Prediction Record
    const prediction = Prediction.create(
        this.predictionRepository.generateId(),
        userId,
        cleanSymbol,
        direction as PredictionDirection,
        amount,
        expiresAt,
        openPrice
    );

    await this.predictionRepository.save(prediction);

    return {
        id: prediction.id,
        status: 'PENDING',
        openPrice,
        investment: amount,
        expiresAt: expiresAt,
        message: 'Trade placed. Waiting for completion.'
    };
  }
}