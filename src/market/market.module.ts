import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CryptoRateService } from 'src/wallet/infrastructure/services/crypto-rate.service'; 
// Note: You can move the file physically to src/market/infrastructure/services/ later if you want, 
// but for now, just importing it works.

@Module({
  imports: [
    // Move the Cache registration here, since the Service uses it
    CacheModule.register({ 
      ttl: 10 * 60 * 1000, // 10 Minutes
      max: 100,
    }),
  ],
  providers: [
    CryptoRateService
  ],
  exports: [
    CryptoRateService // Export so Wallet and Asset can use it
  ],
})
export class MarketModule {}