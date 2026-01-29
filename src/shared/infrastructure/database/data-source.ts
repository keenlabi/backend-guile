import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
import { DataSource } from 'typeorm';
import { UserModel } from '../../../user/infrastructure/persistence/models/user.model';
import { ProfileModel } from '../../../user/infrastructure/persistence/models/profile.model';
import { WalletModel } from '../../../wallet/infrastructure/persistence/models/wallet.model';
import { AssetModel } from '../../../asset/infrastructure/persistence/models/asset.model';
import { TransactionModel } from '../../../wallet/infrastructure/persistence/models/transaction.model';
import { OrderModel } from '../../../order/infrastructure/models/order.model';
import { PredictionModel } from '../../../prediction/infrastructure/persistence/models/prediction.model';
import { KycRecordModel } from '../../../user/infrastructure/persistence/models/kyc.model';


export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DATABASE_HOST || 'localhost',
	port: parseInt(process.env.DATABASE_PORT || '5432', 10),
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	synchronize: false,
	// logging: process.env.NODE_ENV === 'development',
	entities: [
		UserModel,
		ProfileModel,
		AssetModel,
		WalletModel,
		TransactionModel,
		OrderModel,
		PredictionModel,
		KycRecordModel
	],
	migrations: ['src/shared/infrastructure/database/migrations/*.ts'],
	migrationsTableName: 'migrations',
});
