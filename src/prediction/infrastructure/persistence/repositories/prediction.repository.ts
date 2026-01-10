import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PredictionModel } from '../models/prediction.model';
import { Prediction, PredictionStatus } from '../../../domain/entities/prediction.entity';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

@Injectable()
export class PredictionRepository extends BaseRepository<Prediction, PredictionModel> {
  constructor(
    @InjectRepository(PredictionModel)
    readonly repository: Repository<PredictionModel>,
  ) {
    super(repository);
  }

  async save(entity: Prediction) {
    const model = this.toPersistence(entity);
    const savedModel = await this.repository.save(model);
    return this.toDomain(savedModel);
  }

  async findAllPending(): Promise<Prediction[]> {
    const models = await this.repository.find({
      where: { 
        status: PredictionStatus.PENDING 
      },
      order: { created_at: 'DESC' }, // Oldest or Newest first? Usually DESC to see latest activity.
      relations: ['user'], // Useful to see WHO placed the bet
    });
    return models.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<Prediction[]> {
    const models = await this.repository.find({
      where: { 
        user_id: userId
      },
      order: { created_at: 'DESC' }
    });
    return models.map(this.toDomain);
  }

  protected toDomain(model: PredictionModel): Prediction {
    return new Prediction(
      model.id,
      model.user_id,
      model.symbol,
      model.direction,
      Number(model.investment),
      model.expires_at,
      Number(model.open_price),
      model.close_price ? Number(model.close_price) : null,
      model.result,
      model.payout ? Number(model.payout) : null,
      model.status,
      model.created_at,
      model.resolved_at
    );
  }

  protected toPersistence(entity: Prediction): PredictionModel {
    const model = new PredictionModel();
    model.id = entity.id;
    model.user_id = entity.userId;
    model.symbol = entity.symbol;
    model.direction = entity.direction;
    model.investment = entity.investment;
    model.expires_at = entity.expiresAt;
    model.open_price = entity.openPrice;
    model.close_price = entity.closePrice as number;
    model.result = entity.result as any;
    model.payout = entity.payout as number;
    model.status = entity.status;
    model.resolved_at = entity.resolvedAt as Date;
    return model;
  }
}