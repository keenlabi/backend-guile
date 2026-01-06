// import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { OrderRepository } from '../../infrastructure/persistence/repositories/order.repository';
// import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
// import { CryptoRateService } from '../../infrastructure/services/crypto-rate.service';
// import { Order, OrderSide } from '../../domain/entities/order.entity';

// @Injectable()
// export class PlaceOrderUseCase {
//   constructor(
//     @Inject('IWalletRepository') private readonly walletRepository: IWalletRepository,
//     private readonly orderRepository: OrderRepository,
//     private readonly cryptoRateService: CryptoRateService,
//   ) {}

//   async execute(userId: string, symbol: string, side: string, amountUsd: number) {
//     const orderSide = side === 'BUY' ? OrderSide.BUY : OrderSide.SELL;
//     const cleanSymbol = symbol.toUpperCase();

//     // 1. Get Wallet
//     const wallet = await this.walletRepository.findByUserId(userId);
//     if (!wallet) throw new NotFoundException('Wallet not found');

//     // 2. Get Real-Time Price
//     const price = await this.cryptoRateService.getRateInUsd(cleanSymbol);
//     if (price === 0) throw new BadRequestException('Invalid price data');

//     // 3. Calculate Quantity (Token Amount)
//     // Formula: Quantity = USD Amount / Price
//     const quantity = amountUsd / price;

//     // 4. Validate Balance & Update Wallet Logic
//     if (orderSide === OrderSide.BUY) {
//       // --- BUY LOGIC (Spend USD, Get Token) ---
      
//       // Check USD Balance
//       if (Number(wallet.balance) < amountUsd) {
//         throw new BadRequestException(`Insufficient USD balance. Available: $${wallet.balance}`);
//       }

//       // Debit USD
//       wallet.balance = Number(wallet.balance) - amountUsd;

//       // Credit Token
//       const currentAsset = wallet.assets[cleanSymbol] || { balance: 0 };
//       const newBalance = Number(currentAsset.balance) + quantity;
//       wallet.assets = { ...wallet.assets, [cleanSymbol]: { balance: newBalance } };

//     } else {
//       // --- SELL LOGIC (Spend Token, Get USD) ---

//       // Check Token Balance
//       const currentAsset = wallet.assets[cleanSymbol];
//       if (!currentAsset || Number(currentAsset.balance) < quantity) {
//         throw new BadRequestException(`Insufficient ${cleanSymbol} balance. Available: ${currentAsset?.balance || 0}`);
//       }

//       // Debit Token
//       const newAssetBal = Number(currentAsset.balance) - quantity;
//       wallet.assets = { ...wallet.assets, [cleanSymbol]: { balance: newAssetBal } };

//       // Credit USD
//       wallet.balance = Number(wallet.balance) + amountUsd;
//     }

//     // 5. Save Changes Atomically (Ideal to wrap in transaction)
//     await this.walletRepository.save(wallet);

//     // 6. Record the Order
//     const order = Order.create(
//       this.orderRepository.generateId(),
//       userId,
//       cleanSymbol,
//       orderSide,
//       quantity,
//       price,
//       amountUsd
//     );
//     await this.orderRepository.save(order);

//     return {
//       success: true,
//       data: {
//         id: order.id,
//         side: orderSide,
//         symbol: cleanSymbol,
//         quantity: quantity,
//         price: price,
//         totalUsd: amountUsd,
//         newUsdBalance: wallet.balance
//       }
//     };
//   }
// }