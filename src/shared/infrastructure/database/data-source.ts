import { DataSource } from 'typeorm';
import { UserModel } from '../../../user/infrastructure/persistence/models/user.model';
import { ProfileModel } from '../../../user/infrastructure/persistence/models/profile.model';


export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DATABASE_HOST || 'localhost',
	port: parseInt(process.env.DATABASE_PORT || '5432', 10),
	username: process.env.DATABASE_USER || 'postgres',
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME || 'nuvlon_dev',
	synchronize: false,
	// logging: process.env.NODE_ENV === 'development',
	entities: [
		UserModel,
		ProfileModel,
	],
	migrations: ['src/shared/infrastructure/database/migrations/*.ts'],
	migrationsTableName: 'migrations',
});
