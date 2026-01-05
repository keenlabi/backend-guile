export class Asset {
  constructor(
    public readonly id: string,
    public readonly symbol: string,
    public readonly name: string,
    public readonly decimals: number,
    public readonly type: 'crypto' | 'fiat' | 'stablecoin',
    public isDepositEnabled: boolean = true,
    public isWithdrawalEnabled: boolean = true,
    public isTradingEnabled: boolean = true,
    public readonly iconUrl?: string,
    public readonly depositAddress?: string, // Add this field
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static fromPersistence(
    id: string,
    symbol: string,
    name: string,
    decimals: number,
    type: string,
    isDepositEnabled: boolean,
    isWithdrawalEnabled: boolean,
    isTradingEnabled: boolean,
    iconUrl: string | undefined,
    depositAddress: string | undefined, // Add here
    createdAt: Date,
    updatedAt: Date,
  ): Asset {
    return new Asset(
      id,
      symbol,
      name,
      decimals,
      type as 'crypto' | 'fiat' | 'stablecoin',
      isDepositEnabled,
      isWithdrawalEnabled,
      isTradingEnabled,
      iconUrl,
      depositAddress, // And here
      createdAt,
      updatedAt,
    );
  }
}