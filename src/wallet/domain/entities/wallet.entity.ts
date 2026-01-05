export interface WalletAsset {
  balance: number;
}

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public balance: number,
    public assets: Record<string, WalletAsset>, // Key is the Symbol (e.g. "BTC")
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(id: string, userId: string, initialAssets: Record<string, WalletAsset>): Wallet {
    return new Wallet(id, userId, 0, initialAssets, new Date(), new Date());
  }

  static fromPersistence(
    id: string,
    userId: string,
    balance: number,
    assets: Record<string, WalletAsset>,
    createdAt: Date,
    updatedAt: Date,
  ): Wallet {
    return new Wallet(id, userId, balance, assets, createdAt, updatedAt);
  }
}