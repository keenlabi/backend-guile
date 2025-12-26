import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infrastructure/persistence/models/user.model';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { UserController } from './infrastructure/controllers/user.controller';
import { TokenModule } from 'src/shared/auth/token.module';
import { ProfileRepository } from './infrastructure/persistence/repositories/profile.repository';
import { ProfileModel } from './infrastructure/persistence/models/profile.model';
import { FindUserGeneralProfileUseCase } from './application/usecases/find-user-general-profile.usecase';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserModel,
			ProfileModel
		]),
		TokenModule,
	],
	controllers: [UserController],
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
		FindUserGeneralProfileUseCase,
	],
	exports: [
		'IUserRepository',
		'IProfileRepository'
	],
})
export class UserModule {}
