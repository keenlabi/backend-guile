import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetAllAssetsUseCase } from '../../application/usecases/get-all-assets.usecase';

@Controller('assets')
export class AssetController {
  constructor(private readonly getAllAssetsUseCase: GetAllAssetsUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAssets() {
    const assets = await this.getAllAssetsUseCase.execute();
    return {
      data: assets.map(asset => ({
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type,
        decimals: asset.decimals,
        isDepositEnabled: asset.isDepositEnabled,
        isTradingEnabled: asset.isTradingEnabled,
        iconUrl: asset.iconUrl,
        depositAddress: asset.depositAddress, // Now sending this to client
      })),
    };
  }
}