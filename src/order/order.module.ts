import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from 'src/wallet/wallet.module'; // Import Wallet for Balance checks
import { MarketModule } from 'src/market/market.module'; // Import Market for Prices
import { TokenModule } from 'src/shared/auth/token.module'; // For Auth Guards
import { OrderModel } from './infrastructure/models/order.model';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderRepository } from './infrastructure/repositories/order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderModel]),
    WalletModule, // Gives access to 'IWalletRepository'
    MarketModule, // Gives access to CryptoRateService
    TokenModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderRepository,
  ],
  exports: [OrderRepository], // Export if you need to show Order History in other modules
})
export class OrderModule {}