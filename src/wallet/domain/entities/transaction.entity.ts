export class Transaction {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: 'CREDIT' | 'DEBIT',
    public readonly symbol: string,
    public readonly amountUsd: number,
    public readonly tokenAmount: number,
    public readonly rateAtTime: number,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(
    id: string,
    userId: string,
    type: 'CREDIT' | 'DEBIT',
    symbol: string,
    amountUsd: number,
    tokenAmount: number,
    rateAtTime: number,
  ): Transaction {
    return new Transaction(id, userId, type, symbol, amountUsd, tokenAmount, rateAtTime);
  }
}