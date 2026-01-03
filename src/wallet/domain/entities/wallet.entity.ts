export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public balance: number = 0,
    public assets: Record<string, number> = {}, // e.g., { "BTC": 0.5 }
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    // Ensure we handle floating point addition safely in a real app, 
    // but for now standard addition matches your requirement.
    this.balance = Number(this.balance) + Number(amount);
  }

  // Factory method
  static create(id: string, userId: string): Wallet {
    return new Wallet(id, userId, 0, {});
  }

  static fromPersistence(
    id: string,
    userId: string,
    balance: number,
    assets: Record<string, number>,
    createdAt: Date,
    updatedAt: Date,
  ): Wallet {
    return new Wallet(id, userId, balance, assets, createdAt, updatedAt);
  }
}