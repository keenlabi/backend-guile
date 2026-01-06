import { Inject, Injectable } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import * as assetRepositoryInterface from '../../../asset/domain/repositories/asset.repository.interface';
import { Wallet, WalletAsset } from '../../domain/entities/wallet.entity';
import { CryptoRateService } from '../../infrastructure/services/crypto-rate.service';
import { JoinedAsset } from '../dtos/wallet-response.dto';

@Injectable()
export class GetMyWalletUseCase {
  constructor(
    @Inject('IWalletRepository') private readonly walletRepo: walletRepositoryInterface.IWalletRepository,
    @Inject('IAssetRepository') private readonly assetRepo: assetRepositoryInterface.IAssetRepository,
    private readonly cryptoRateService: CryptoRateService, // 1. Inject Service
  ) {}

  async execute(userId: string) {
    let wallet = await this.walletRepo.findByUserId(userId);

    // 1. Auto-Provisioning
    if (!wallet) {
      const allAssets = await this.assetRepo.findAll();
      const initialAssets: Record<string, WalletAsset> = {};

      allAssets.forEach((asset) => {
        initialAssets[asset.symbol] = { balance: 0 };
      });

      wallet = Wallet.create(this.walletRepo.generateId(), userId, initialAssets);
      await this.walletRepo.save(wallet);
    }

    // 2. Fetch Assets & Rates
    const allAssets = await this.assetRepo.findAll();

    // 3. Map with Async Rate Fetching
    const joinedAssets: JoinedAsset[] = [];

    // Fetch sequentially instead of parallel to respect API Rate Limits
    for (const asset of allAssets) {
      const userAsset = wallet!.assets[asset.symbol];
      const balance = userAsset ? Number(userAsset.balance) : 0;

      let rate = 0;
      try {
        rate = await this.cryptoRateService.getRateInUsd(asset.symbol);
      } catch (e) {
        console.warn(`Skipping rate for ${asset.symbol}`);
      }
      
      joinedAssets.push({
        symbol: asset.symbol,
        name: asset.name,
        decimals: asset.decimals,
        iconUrl: asset.iconUrl!,
        depositAddress: asset.depositAddress!,
        balance: balance,
        balanceUsd: balance * rate,
        rate: rate,
        isDepositEnabled: asset.isDepositEnabled,
        isWithdrawalEnabled: asset.isWithdrawalEnabled,
        isTradingEnabled: asset.isTradingEnabled,
      });
    }

    return {
      id: wallet.id,
      usdBalance: Number(wallet.balance),
      assets: joinedAssets,
    };
  }
}