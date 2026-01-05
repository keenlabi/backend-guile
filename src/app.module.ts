import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { AuthModule } from './shared/auth/auth.module';
import { configValidationSchema } from './shared/infrastructure/config.schema';
import { WalletModule } from './wallet/wallet.module';
import { AssetModule } from './asset/asset.module';

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
	]
})
export class AppModule {}
