import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infrastructure/persistence/models/user.model';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { UserController } from './infrastructure/controllers/user.controller';
import { TokenModule } from 'src/shared/auth/token.module';
import { ProfileRepository } from './infrastructure/persistence/repositories/profile.repository';
import { ProfileModel } from './infrastructure/persistence/models/profile.model';
import { FindUserUseCase } from './application/usecases/find-user.usecase';
import { GetTradersUseCase } from './application/usecases/get-traders.usecase';
import { ProfileController } from './infrastructure/controllers/profile.controller';
import { FindUserProfileUseCase } from './application/usecases/find-user-profile.usecase';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserModel,
			ProfileModel
		]),
		TokenModule,
	],
	controllers: [UserController, ProfileController],
	providers: [
		{
			// Repository
			provide: 'IUserRepository',
			useClass: UserRepository,
		},
		{
			// Repository
			provide: 'IProfileRepository',
			useClass: ProfileRepository,
		},

		// Use Cases
		RegisterUserUseCase,
		FindUserProfileUseCase,
		FindUserUseCase,
		GetTradersUseCase
	],
	exports: [
		'IUserRepository',
		'IProfileRepository'
	],
})

export class UserModule {}
