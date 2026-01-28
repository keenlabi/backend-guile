import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CryptoRateService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Expanded map to cover common test cases
private readonly symbolMap: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
    BNB: 'binancecoin',
    XRP: 'ripple',
    ADA: 'cardano',
    DOGE: 'dogecoin',
    AVAX: 'avalanche-2',
    DOT: 'polkadot',
    TRX: 'tron',
    MATIC: 'matic-network',
    LTC: 'litecoin',
    // Commodities
    XAU: 'pax-gold',
    // Stablecoins
    USDT: 'tether',
    USDC: 'usd-coin',
    DAI: 'dai',
  };

  // async getRateInUsd(symbol: string): Promise<number> {
  //   const upperSymbol = symbol.toUpperCase();

  //   // 1. Handle Fiat or Stablecoins as 1:1 to prevent slippage/conversion issues
  //   if (['USD', 'USDT', 'USDC', 'DAI'].includes(upperSymbol)) {
  //     return 1.0;
  //   }

  //   const coinId = this.symbolMap[upperSymbol];
    
  //   // 2. Safety Check: Do NOT return a mock value (1000) for unknown coins.
  //   if (!coinId) {
  //     throw new BadRequestException(`Unsupported symbol: ${symbol}. Please add it to the CryptoRateService map.`);
  //   }

  //   // 2. CHECK CACHE FIRST
  //   const cacheKey = `rate_${upperSymbol}`;
  //   const cachedRate = await this.cacheManager.get<number>(cacheKey);
    
  //   if (cachedRate) {
  //     return cachedRate; // Return cached value immediately
  //   }

  //   try {
  //     const response = await axios.get(
  //       `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  //     );
      
  //     const rate = response.data[coinId]?.usd;
      
  //     if (!rate) {
  //        throw new InternalServerErrorException(`Could not retrieve rate for ${symbol}`);
  //     }

  //     return rate;
  //   } catch (error) {
  //     console.error(`Error fetching rate for ${symbol}:`, error.message);
  //     // Fallback for development ONLY if API fails, but using a realistic value is better.
  //     // For now, re-throw to ensure we don't save bad data.
  //     throw new InternalServerErrorException('Failed to fetch current market rate');
  //   }
  // }

  async getOhlc(symbol: string, days: string = '1'): Promise<number[][]> {
    const upperSymbol = symbol.toUpperCase();
    
    // 1. Handle Fiat/Stablecoins (Flat line)
    if (['USD', 'USDT', 'USDC', 'DAI'].includes(upperSymbol)) {
      return []; 
    }

    const coinId = this.symbolMap[upperSymbol];
    if (!coinId) {
      throw new BadRequestException(`Unsupported symbol: ${symbol}`);
    }

    // 2. Check Cache (Cache for 5 mins - candles don't change instantly)
    const cacheKey = `ohlc_${upperSymbol}_${days}`;
    const cachedData = await this.cacheManager.get<number[][]>(cacheKey);
    if (cachedData) return cachedData;

    try {
      // 3. Fetch from CoinGecko
      // days: 1, 7, 14, 30, 90, 180, 365, max
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
      );

      const data = response.data; // Returns [[time, open, high, low, close], ...]

      // 4. Save to Cache (5 minutes = 300,000 ms)
      await this.cacheManager.set(cacheKey, data, 300000); 

      return data;
    } catch (error) {
      console.error(`OHLC Fetch Error [${symbol}]:`, (error as any).message);
      throw new InternalServerErrorException('Market chart data unavailable');
    }
  }

  async getManyRatesInUsd(symbols: string[]): Promise<Record<string, number>> {
    const rates: Record<string, number> = {};
    const idsToFetch: string[] = [];
    const symbolToIdMap: Record<string, string> = {};

    // 1. Check Cache & Prepare IDs
    for (const symbol of symbols) {
      const upper = symbol.toUpperCase();
      
      // Handle Stablecoins/Fiat locally
      if (['USD', 'USDT', 'USDC', 'DAI'].includes(upper)) {
        rates[upper] = 1.0;
        continue;
      }

      const coinId = this.symbolMap[upper];
      if (!coinId) continue; // Skip unsupported or log warning

      // Check Cache
      const cacheKey = `rate_${upper}`;
      const cached = await this.cacheManager.get<number>(cacheKey);

      if (cached !== undefined) {
        rates[upper] = cached;
      } else {
        idsToFetch.push(coinId);
        symbolToIdMap[coinId] = upper; // Map ID back to Symbol (bitcoin -> BTC)
      }
    }

    // 2. Fetch missing from API (One Batch Call)
    if (idsToFetch.length > 0) {
      try {
        const idsString = idsToFetch.join(',');
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd`
        );
        
        // Response format: { "bitcoin": { "usd": 50000 }, "solana": { "usd": 20 } }
        for (const [coinId, data] of Object.entries(response.data)) {
            const price = (data as any).usd;
            const symbol = symbolToIdMap[coinId];
            
            if (price && symbol) {
                rates[symbol] = price;
                // Cache individual keys so single-fetch works later too
                await this.cacheManager.set(`rate_${symbol}`, price, 10 * 60 * 1000);
            }
        }
      } catch (error) {
        console.error('Batch Rate Fetch Error:', (error as any).message);
        // Do not throw; just return what we have (cached) to prevent total crash
      }
    }

    return rates;
  }

  async getRateInUsd(symbol: string): Promise<number> {2
    const rates = await this.getManyRatesInUsd([symbol]);
    return rates[symbol.toUpperCase()] || 0;
  }
}