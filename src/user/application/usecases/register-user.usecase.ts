import { Inject, Injectable } from '@nestjs/common';
import * as userRepositoryInterface from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
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
		// 1. Create Value Objects (Validation happens here)
		const email = new Email(emailValue);
		const password = await Password.fromPlainText(passwordValue);

		// 2. Check existence
		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new UserAlreadyExistsError(emailValue);
		}

		// 3. Create Entity
		const userId = this.userRepository.generateId();
		
		// Note: Ensure your User.create() method is updated to accept the password argument
		const user = User.create(userId, email, password, role);

		// 4. Save
		await this.userRepository.save(user);

		// 5. Issue Tokens
		const tokens = await this.tokenManagerService.issueTokens({
			userId: user.id,
			email: user.email.value,
			role: user.role.value, // Extract string from UserRole VO
		});

		return { user, tokens };
	}
}