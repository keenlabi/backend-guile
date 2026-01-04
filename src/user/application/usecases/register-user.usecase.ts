import { Inject, Injectable } from '@nestjs/common';
import * as userRepositoryInterface from '../../domain/repositories/user.repository.interface';
import * as profileRepositoryInterface from '../../domain/repositories/profile.repository.interface'; // Import this
import { User } from '../../domain/entities/user.entity';
import { Profile } from '../../domain/entities/profile.entity'; // Import this
import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { UserAlreadyExistsError } from '../errors/user.errors';
import { JwtPairResponse, TokenManagerService } from 'src/shared/auth/infrastructure/services/token-manager.service';
import { UserRoleType } from 'src/user/domain/enums/user-role.enum';

@Injectable()
export class RegisterUserUseCase {
	constructor(
		@Inject('IUserRepository')
		private readonly userRepository: userRepositoryInterface.IUserRepository,
        // 1. Inject Profile Repository
		@Inject('IProfileRepository') 
		private readonly profileRepository: profileRepositoryInterface.IProfileRepository,
		private readonly tokenManagerService: TokenManagerService,
	) {}

	async execute(
		emailValue: string,
		passwordValue: string,
		role: string = UserRoleType.TRADER,
	): Promise<{
		user: User;
		tokens: JwtPairResponse;
	}> {
		const email = new Email(emailValue);
		const password = await Password.fromPlainText(passwordValue);

		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new UserAlreadyExistsError(emailValue);
		}

		// 2. Create User
		const userId = this.userRepository.generateId();
		const user = User.create(userId, email, password, role);
		await this.userRepository.save(user);

		// 3. Create Empty Profile linked to User
		const profileId = this.profileRepository.generateId();
		const profile = Profile.createEmpty(profileId, user.id);
		await this.profileRepository.save(profile);

		// 4. Issue Tokens
		const tokens = await this.tokenManagerService.issueTokens({
			userId: user.id,
			email: user.email.value,
			role: user.role.value,
		});

		return { user, tokens };
	}
}