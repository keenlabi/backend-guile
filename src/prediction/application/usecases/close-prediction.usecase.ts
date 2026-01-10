import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PredictionRepository } from '../../infrastructure/persistence/repositories/prediction.repository';
import * as walletRepositoryInterface from 'src/wallet/domain/repositories/wallet.repository.interface';
import { Prediction, PredictionDirection, PredictionResult, PredictionStatus } from '../../domain/entities/prediction.entity';

@Injectable()
export class ClosePredictionUseCase {
  constructor(
    private readonly predictionRepository: PredictionRepository,
    @Inject('IWalletRepository') private readonly walletRepository: walletRepositoryInterface.IWalletRepository,
  ) {}

  async execute(predictionId: string, closePrice: number) {
    const prediction = await this.predictionRepository.findById(predictionId);
    if (!prediction) throw new NotFoundException('Prediction not found');

    if (prediction.status !== PredictionStatus.PENDING) {
        throw new BadRequestException('Prediction is already resolved');
    }

    // 1. Determine Outcome Automatically
    let result = PredictionResult.LOSS;
    
    if (prediction.direction === PredictionDirection.HIGH) {
        if (closePrice > prediction.openPrice) result = PredictionResult.WIN;
        else if (closePrice === prediction.openPrice) result = PredictionResult.DRAW;
    } else {
        // LOW
        if (closePrice < prediction.openPrice) result = PredictionResult.WIN;
        else if (closePrice === prediction.openPrice) result = PredictionResult.DRAW;
    }

    // 2. Calculate Payout
    let payout = 0;
    const PAYOUT_RATIO = 1.8; // Configurable: 80% Profit

    if (result === PredictionResult.WIN) {
        payout = prediction.investment * PAYOUT_RATIO;
    } else if (result === PredictionResult.DRAW) {
        payout = prediction.investment; // Refund on Draw
    }

    // 3. Update Prediction Record
    const updatedPrediction = new Prediction(
        prediction.id,
        prediction.userId,
        prediction.symbol,
        prediction.direction,
        prediction.investment,
        prediction.expiresAt,
        prediction.openPrice,
        closePrice,
        result,
        payout,
        PredictionStatus.RESOLVED,
        prediction.createdAt,
        new Date() // resolvedAt
    );

    await this.predictionRepository.save(updatedPrediction);

    // 4. Update Wallet (Credit Payout)
    if (payout > 0) {
        const wallet = await this.walletRepository.findByUserId(prediction.userId);
        if (wallet) {
            wallet.balance = Number(wallet.balance) + payout;
            await this.walletRepository.save(wallet);
        }
    }

    return updatedPrediction;
  }
}