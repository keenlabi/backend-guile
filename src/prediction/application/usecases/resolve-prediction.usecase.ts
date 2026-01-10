import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PredictionRepository } from '../../infrastructure/persistence/repositories/prediction.repository';
import * as walletRepositoryInterface from 'src/wallet/domain/repositories/wallet.repository.interface';
import { Prediction, PredictionResult, PredictionStatus } from '../../domain/entities/prediction.entity';

@Injectable()
export class ResolvePredictionUseCase {
  constructor(
    private readonly predictionRepository: PredictionRepository,
    @Inject('IWalletRepository') private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
  ) {}

  async execute(predictionId: string, outcome: 'WIN' | 'LOSS', openPrice: number|null, closePrice: number|null, payout: number) {
    const prediction = await this.predictionRepository.findById(predictionId);
    if (!prediction) throw new NotFoundException('Prediction not found');

    if (prediction.status !== PredictionStatus.PENDING) {
        throw new Error('Prediction is already resolved');
    }

    let pnl = 0;

    // 1. Calculate Payout
    if (outcome === 'WIN') {
      pnl = payout
    }

    // 2. Update Prediction Record
    const updatedPrediction = new Prediction (
        prediction.id,
        prediction.userId,
        prediction.symbol,
        prediction.direction,
        prediction.investment,
        prediction.expiresAt,
        
        // New Fields:
        prediction.openPrice,
        closePrice,
        outcome === 'WIN' ? PredictionResult.WIN : PredictionResult.LOSS,
        pnl,
        PredictionStatus.RESOLVED,
        prediction.createdAt,
        new Date()
    );

    await this.predictionRepository.save(updatedPrediction);

    // 3. Credit User (If Win)
    if (payout > 0) {
      const wallet = await this.walletRepository.findByUserId(prediction.userId);
      if (wallet) {
        let currentBalance = 0;
        if(!isNaN(wallet.balance)) {
          currentBalance = Number(wallet.balance);
        }
          
        wallet.balance = currentBalance + pnl;
        await this.walletRepository.save(wallet);
      }
    }

    return updatedPrediction;
  }
}