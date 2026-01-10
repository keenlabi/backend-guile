export enum PredictionDirection {
  HIGH = 'HIGH',
  LOW = 'LOW',
}

export enum PredictionStatus {
  PENDING = 'PENDING', // Timer running or waiting for Admin
  RESOLVED = 'RESOLVED',
}

export enum PredictionResult {
  WIN = 'WIN',
  LOSS = 'LOSS',
  DRAW = 'DRAW',
}

export class Prediction {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly symbol: string,
    public readonly direction: PredictionDirection,
    public readonly investment: number, // USD Amount
    public readonly expiresAt: Date,
    
    public readonly openPrice: number, // Price when user clicked
    
    // Admin Inputs (Nullable until resolved)
    public readonly closePrice: number | null,
    public readonly result: PredictionResult | null,
    public readonly payout: number | null, // Total return (0 if loss)
    
    public readonly status: PredictionStatus,
    public readonly createdAt: Date = new Date(),
    public readonly resolvedAt: Date | null = null,
  ) {}

  static create(
    id: string,
    userId: string,
    symbol: string,
    direction: PredictionDirection,
    investment: number,
    expiresAt: Date,
    openPrice: number,
  ): Prediction {
    return new Prediction(
      id, userId, symbol, direction, investment, expiresAt,
      openPrice, null, null, null, PredictionStatus.PENDING
    );
  }
}