import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AssetModel } from '../models/asset.model';
import { IAssetRepository } from 'src/asset/domain/repositories/asset.repository.interface';
import { Asset } from 'src/asset/domain/entities/asset.entity';

@Injectable()
export class AssetRepository implements IAssetRepository {
  constructor(
    @InjectRepository(AssetModel)
    private readonly repository: Repository<AssetModel>,
  ) {}

  async findAll(): Promise<Asset[]> {
    const models = await this.repository.find({ order: { symbol: 'ASC' } });
    return models.map(this.toDomain);
  }

  async findBySymbol(symbol: string): Promise<Asset | null> {
    const model = await this.repository.findOne({ where: { symbol } });
    if (!model) return null;
    return this.toDomain(model);
  }

  async save(entity: Asset): Promise<Asset> {
    const model = this.toPersistence(entity);
    const saved = await this.repository.save(model);
    return this.toDomain(saved);
  }

  private toDomain(model: AssetModel): Asset {
    return Asset.fromPersistence(
      model.id,
      model.symbol,
      model.name,
      model.decimals,
      model.type,
      model.is_deposit_enabled,
      model.is_withdrawal_enabled,
      model.is_trading_enabled,
      model.icon_url,
      model.deposit_address, // Map from model
      model.created_at,
      model.updated_at,
    );
  }

  private toPersistence(entity: Asset): AssetModel {
    const model = new AssetModel();
    model.symbol = entity.symbol;
    model.name = entity.name;
    model.decimals = entity.decimals;
    model.type = entity.type;
    model.is_deposit_enabled = entity.isDepositEnabled;
    model.is_withdrawal_enabled = entity.isWithdrawalEnabled;
    model.is_trading_enabled = entity.isTradingEnabled;
    model.icon_url = entity.iconUrl ?? ""; // Fallback or handle null properly in strict mode
    model.deposit_address = entity.depositAddress ?? "";
    return model;
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<AssetModel> {
    return this.repository.createQueryBuilder(alias);
  }
}