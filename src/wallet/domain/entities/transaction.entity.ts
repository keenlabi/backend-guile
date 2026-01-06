export enum TransactionType {
  DEPOSIT = 'DEPOSIT',       // Money In (Blockchain or Admin Credit)
  WITHDRAWAL = 'WITHDRAWAL', // Money Out
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: TransactionType,
    public readonly symbol: string, // e.g., 'BTC'
    public readonly amountUsd: number,
    public readonly tokenAmount: number,
    public readonly rateAtTime: number,
    public readonly status: TransactionStatus,
    
    // "Evidence" fields (Make it look real)
    public readonly txHash?: string,
    public readonly senderAddress?: string,
    public readonly network?: string,

    public readonly createdAt: Date = new Date(),
  ) {}

  static create(
    id: string,
    userId: string,
    type: TransactionType,
    symbol: string,
    amountUsd: number,
    tokenAmount: number,
    rateAtTime: number,
    status: TransactionStatus = TransactionStatus.COMPLETED,
    txHash?: string,
    senderAddress?: string,
    network?: string,
  ): Transaction {
    return new Transaction(
      id, userId, type, symbol, amountUsd, tokenAmount, rateAtTime, 
      status, txHash, senderAddress, network
    );
  }
}