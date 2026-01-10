export interface WalletAsset {
  balance: number;
}

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public balance: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(id: string, userId: string): Wallet {
    return new Wallet(id, userId, 0, new Date(), new Date());
  }

  static fromPersistence(
    id: string,
    userId: string,
    balance: number,
    createdAt: Date,
    updatedAt: Date,
  ): Wallet {
    return new Wallet(id, userId, balance, createdAt, updatedAt);
  }
}