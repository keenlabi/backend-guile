export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderStatus {
  FILLED = 'FILLED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly symbol: string,
    public readonly side: OrderSide,
    public readonly quantity: number, // Amount of Token (e.g., 0.5 BTC)
    public readonly price: number,    // Price at execution (e.g., $50,000)
    public readonly totalUsd: number, // Total Cost/Value (e.g., $25,000)
    public readonly status: OrderStatus,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(
    id: string,
    userId: string,
    symbol: string,
    side: OrderSide,
    quantity: number,
    price: number,
    totalUsd: number,
  ): Order {
    return new Order(id, userId, symbol, side, quantity, price, totalUsd, OrderStatus.FILLED);
  }
}