import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModel } from 'src/asset/infrastructure/persistence/models/asset.model';
import { ProfileModel } from 'src/user/infrastructure/persistence/models/profile.model';
import { UserModel } from 'src/user/infrastructure/persistence/models/user.model';
import { WalletModel } from 'src/wallet/infrastructure/persistence/models/wallet.model';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('DATABASE_HOST'),
				port: configService.get<number>('DATABASE_PORT'),
				username: configService.get<string>('DATABASE_USER'),
				password: configService.get<string>('DATABASE_PASSWORD'),
				database: configService.get<string>('DATABASE_NAME'),
				synchronize: false,
				// logging: configService.get<string>('NODE_ENV') === 'development',
				entities: [
					UserModel,
					ProfileModel,
					AssetModel,
					WalletModel
				],
				autoLoadEntities: true,
			}),
		}),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {}
