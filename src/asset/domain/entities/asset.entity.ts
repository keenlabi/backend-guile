export class Asset {
  constructor(
    public readonly symbol: string, // e.g. "BTC" (Primary Key)
    public readonly name: string,   // e.g. "Bitcoin"
    public readonly decimals: number,
    public readonly type: 'crypto' | 'fiat' | 'stablecoin',
    public isDepositEnabled: boolean = true,
    public isWithdrawalEnabled: boolean = true,
    public isTradingEnabled: boolean = true,
    public readonly iconUrl?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    symbol: string,
    name: string,
    decimals: number,
    type: 'crypto' | 'fiat' | 'stablecoin'
  ): Asset {
    return new Asset(symbol, name, decimals, type);
  }

  static fromPersistence(
    symbol: string,
    name: string,
    decimals: number,
    type: string,
    isDepositEnabled: boolean,
    isWithdrawalEnabled: boolean,
    isTradingEnabled: boolean,
    iconUrl: string | undefined,
    createdAt: Date,
    updatedAt: Date,
  ): Asset {
    return new Asset(
      symbol,
      name,
      decimals,
      type as 'crypto' | 'fiat' | 'stablecoin',
      isDepositEnabled,
      isWithdrawalEnabled,
      isTradingEnabled,
      iconUrl,
      createdAt,
      updatedAt,
    );
  }
}