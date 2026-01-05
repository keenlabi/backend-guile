import { Inject, Injectable } from '@nestjs/common';
import * as walletRepositoryInterface from '../../domain/repositories/wallet.repository.interface';
import * as assetRepositoryInterface from '../../../asset/domain/repositories/asset.repository.interface';
import { Wallet, WalletAsset } from '../../domain/entities/wallet.entity';

@Injectable()
export class GetMyWalletUseCase {
  constructor(
    @Inject('IWalletRepository') private readonly walletRepo: walletRepositoryInterface.IWalletRepository,
    @Inject('IAssetRepository') private readonly assetRepo: assetRepositoryInterface.IAssetRepository,
  ) {}

  async execute(userId: string) {
    let wallet = await this.walletRepo.findByUserId(userId);

    // 1. Auto-Provisioning (Create if missing)
    if (!wallet) {
      const allAssets = await this.assetRepo.findAll();
      const initialAssets: Record<string, WalletAsset> = {};

      allAssets.forEach((asset) => {
        initialAssets[asset.symbol] = { balance: 0 };
      });

      wallet = Wallet.create(this.walletRepo.generateId(), userId, initialAssets);
      await this.walletRepo.save(wallet);
    }

    // 2. The JOIN Logic (Fixed)
    // Instead of a complex innerJoin string, we fetch the assets and map them in JS.
    // This is safer, cleaner, and avoids the TypeORM raw SQL quoting error.
    
    const allAssets = await this.assetRepo.findAll();

    const joinedAssets = allAssets.map(asset => {
      // Safely access the wallet assets using the symbol
      const userAsset = wallet!.assets[asset.symbol]; 
      
      return {
        symbol: asset.symbol,
        name: asset.name,
        decimals: asset.decimals,
        iconUrl: asset.iconUrl!,
        depositAddress: asset.depositAddress!,
        balance: userAsset ? userAsset.balance : 0, // Get balance or default to 0
        isDepositEnabled: asset.isDepositEnabled,
        isWithdrawalEnabled: asset.isWithdrawalEnabled,
        isTradingEnabled: asset.isTradingEnabled,
      };
    });

    return {
      id: wallet.id,
      usdBalance: Number(wallet.balance),
      assets: joinedAssets,
    };
  }
}