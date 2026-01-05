export interface JoinedAsset {
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  iconUrl: string;
  depositAddress: string;
}

export interface WalletResponse {
  id: string;
  usdBalance: number;
  assets: JoinedAsset[];
}