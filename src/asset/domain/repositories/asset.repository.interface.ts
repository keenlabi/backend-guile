import { Asset } from '../entities/asset.entity';

export interface IAssetRepository {
  findAll(): Promise<Asset[]>;
  findBySymbol(symbol: string): Promise<Asset | null>;
  save(asset: Asset): Promise<Asset>;
}