// src/user/application/usecases/authenticate-user.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import * as userRepositoryInterface from 'src/user/domain/repositories/user.repository.interface';
import { Email } from 'src/user/domain/value-objects/email';
import { InvalidCredentialsError } from '../../../../user/application/errors/user.errors';
import { JwtPairResponse, TokenManagerService } from 'src/shared/auth/infrastructure/services/token-manager.service';

@Injectable()
export class AuthenticateUserUseCase {
	constructor(
		@Inject('IUserRepository')
		private readonly userRepository: userRepositoryInterface.IUserRepository,
		private readonly tokenManagerService: TokenManagerService,
	) {}

	async execute(
		emailValue: string,
		passwordValue: string,
	): Promise<{ user: User; tokens: JwtPairResponse }> {
		const email = new Email(emailValue);

		// 1. Find the core User by their email
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new InvalidCredentialsError('Oops! The email or password entered does not match our record. Please confirm and try again.');
		}

		// 3. Verify the password against the identity
		const isValidPassword = await user.verifyPassword(passwordValue);
		if (!isValidPassword) {
			throw new InvalidCredentialsError('Oops! The email or password entered does not match our record. Please confirm and try again.');
		}

		// 4. Issue tokens for the User
		const tokens = await this.tokenManagerService.issueTokens({
			userId: user.id,
			email: user.email.value,
			role: user.role,
		});

		return { user, tokens };
	}
}
