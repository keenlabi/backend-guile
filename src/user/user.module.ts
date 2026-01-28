import { forwardRef, Module } from '@nestjs/common';
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
import { AdminKycController } from './infrastructure/controllers/admin-kyc.controller';
import { KycController } from './infrastructure/controllers/kyc.controller';
import { SubmitKycUseCase } from './application/usecases/submit-kyc.usecase';
import { GetPendingKycUseCase } from './application/usecases/get-pending-kyc.usecase';
import { ReviewKycUseCase } from './application/usecases/review-kyc.usecase';
import { KycRecordModel } from './infrastructure/persistence/models/kyc.model';
import { ToggleManagedModeUseCase } from './application/usecases/toggle-managed-mode.usecase';
import { WalletModule } from 'src/wallet/wallet.module';
import { GetKycStatusUseCase } from './application/usecases/get-kyc-status.usecase';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserModel,
			ProfileModel,
			KycRecordModel
		]),
		TokenModule,
		forwardRef(() => WalletModule)
	],
	controllers: [
		UserController, 
		ProfileController,
		KycController,
		AdminKycController
	],
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
		GetTradersUseCase,
		SubmitKycUseCase,
    	GetPendingKycUseCase,
    	ReviewKycUseCase,
		ToggleManagedModeUseCase,
		GetKycStatusUseCase
	],
	exports: [
		'IUserRepository',
		'IProfileRepository',
	],
})

export class UserModule {}
