import { Inject, Injectable } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import * as assetRepositoryInterface from '../../../asset/domain/repositories/asset.repository.interface';
import { Wallet } from '../../domain/entities/wallet.entity';
import { CryptoRateService } from '../../infrastructure/services/crypto-rate.service';
import { JoinedAsset } from '../dtos/wallet-response.dto';

@Injectable()
export class GetMyWalletUseCase {
  constructor(
    @Inject('IWalletRepository') private readonly walletRepo: walletRepositoryInterface.IWalletRepository,
    @Inject('IAssetRepository') private readonly assetRepo: assetRepositoryInterface.IAssetRepository,
    private readonly cryptoRateService: CryptoRateService,
  ) {}

  async execute(userId: string) {
    let wallet = await this.walletRepo.findByUserId(userId);

    // 1. Simplified Creation: Just create an empty wallet if missing
    if (!wallet) {
      wallet = Wallet.create(this.walletRepo.generateId(), userId);
      await this.walletRepo.save(wallet);
    }

    // 2. Fetch Global Asset List (The "Menu" of tradeable coins)
    const allAssets = await this.assetRepo.findAll();

    // 3. Batch Fetch Rates (Optimization)
    const allSymbols = allAssets.map(a => a.symbol);
    const ratesMap = await this.cryptoRateService.getManyRatesInUsd(allSymbols);

    // 4. Dynamic Merge: Global List + User Holdings
    const joinedAssets: JoinedAsset[] = allAssets.map(asset => {
      // If user has the asset in JSON, use it. If not, balance is 0.
      const userAsset = wallet!.assets[asset.symbol]; 
      const balance = userAsset ? Number(userAsset.balance) : 0;
      
      const rate = ratesMap[asset.symbol.toUpperCase()] || 0;

      return {
        symbol: asset.symbol,
        name: asset.name,
        decimals: asset.decimals,
        iconUrl: asset.iconUrl || '',
        depositAddress: asset.depositAddress || '',
        balance: balance,
        balanceUsd: balance * rate,
        rate: rate,
        isDepositEnabled: asset.isDepositEnabled,
        isWithdrawalEnabled: asset.isWithdrawalEnabled,
        isTradingEnabled: asset.isTradingEnabled,
      };
    });

    const totalPortfolioValue = Number(wallet.balance) + joinedAssets.reduce((sum, a) => sum + a.balanceUsd, 0);

    return {
      id: wallet.id,
      usdBalance: totalPortfolioValue,     // Total Net Worth (Cash + Crypto)
      fiatBalance: Number(wallet.balance), // Buying Power (Cash Only)
      assets: joinedAssets,
    };
  }
}