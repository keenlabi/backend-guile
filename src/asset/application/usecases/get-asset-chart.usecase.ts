import { Injectable } from '@nestjs/common';
import { CryptoRateService } from 'src/wallet/infrastructure/services/crypto-rate.service';

export interface ChartCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

@Injectable()
export class GetAssetChartUseCase {
  constructor(private readonly cryptoRateService: CryptoRateService) {}

  async execute(symbol: string, days: string): Promise<ChartCandle[]> {
    const ohlcData = await this.cryptoRateService.getOhlc(symbol, days);

    // Transform CoinGecko format [[t, o, h, l, c]] to Object format
    return ohlcData.map((candle) => ({
      time: candle[0] / 1000, // Lightweight charts usually wants seconds, CoinGecko sends ms. Check your frontend lib docs.
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
    }));
  }
}