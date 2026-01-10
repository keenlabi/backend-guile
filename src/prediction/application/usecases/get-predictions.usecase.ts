import { Injectable } from '@nestjs/common';
import { PredictionRepository } from '../../infrastructure/persistence/repositories/prediction.repository';
import { Prediction } from '../../domain/entities/prediction.entity';

@Injectable()
export class GetPredictionsUseCase {
  constructor(
    // We inject the concrete repository class directly as per your module setup
    private readonly predictionRepository: PredictionRepository,
  ) {}

  async execute(userId: string): Promise<Prediction[]> {
    // Delegates the query to the repository method you just created
    return await this.predictionRepository.findByUserId(userId);
  }
}