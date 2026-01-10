import { Injectable } from '@nestjs/common';
import { PredictionRepository } from '../../infrastructure/persistence/repositories/prediction.repository';
import { Prediction } from '../../domain/entities/prediction.entity';

@Injectable()
export class GetPendingPredictionsUseCase {
  constructor(
    private readonly predictionRepository: PredictionRepository,
  ) {}

  async execute(): Promise<Prediction[]> {
    return await this.predictionRepository.findAllPending();
  }
}