import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetAssetChartUseCase } from '../../application/usecases/get-asset-chart.usecase';

@Controller('market')
export class MarketController {
  constructor(private readonly getAssetChartUseCase: GetAssetChartUseCase) {}

  @Get(':symbol/chart')
  async getChart(
    @Param('symbol') symbol: string,
    @Query('days') days: string = '1',
  ) {
    const data = await this.getAssetChartUseCase.execute(symbol, days);
    return { 
        symbol: symbol.toUpperCase(),
        data 
    };
  }
}