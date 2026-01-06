export interface JoinedAsset {
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  iconUrl: string;
  depositAddress: string;
  // Add these new fields:
  balanceUsd: number;
  rate: number;
  isDepositEnabled: boolean;
  isWithdrawalEnabled: boolean;
  isTradingEnabled: boolean;
}

export interface WalletResponse {
  id: string;
  usdBalance: number;
  assets: JoinedAsset[];
}