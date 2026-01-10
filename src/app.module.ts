import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { AuthModule } from './shared/auth/auth.module';
import { configValidationSchema } from './shared/infrastructure/config.schema';
import { WalletModule } from './wallet/wallet.module';
import { AssetModule } from './asset/asset.module';
import { MarketModule } from './market/market.module';
import { OrderModule } from './order/order.module';
import { PredictionModule } from './prediction/prediction.module';

const configModuleOptions = {
	isGlobal: true,
	envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
	validationSchema: configValidationSchema,
};

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		DatabaseModule,
		
		AuthModule,
		UserModule,
		AssetModule,
		WalletModule,
		MarketModule,
		OrderModule,
		PredictionModule
	]
})
export class AppModule {}
