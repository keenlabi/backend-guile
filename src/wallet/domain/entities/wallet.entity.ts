export interface WalletAsset {
  balance: number;
}

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public balance: number, // USD Fiat Balance (The "Base")
    public assets: Record<string, WalletAsset>, // Crypto Holdings
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  // SIMPLIFIED: No need to pass initialAssets. Start with empty object.
  static create(id: string, userId: string): Wallet {
    return new Wallet(id, userId, 0, {}, new Date(), new Date());
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