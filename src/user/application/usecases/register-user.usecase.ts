import { Inject, Injectable } from '@nestjs/common';
import * as userRepositoryInterface from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email';
import { UserAlreadyExistsError } from '../errors/user.errors';
import { JwtPairResponse, TokenManagerService } from 'src/shared/auth/infrastructure/services/token-manager.service';

@Injectable()
export class RegisterUserUseCase {
	constructor(
		@Inject('IUserRepository')
		private readonly userRepository: userRepositoryInterface.IUserRepository,
		private readonly tokenManagerService: TokenManagerService,
	) {}

	async execute(
		emailValue: string,
		password: string,
		role: string = 'seeker',
	): Promise<{
		user: User;
		tokens: JwtPairResponse;
	}> {
		// Create value objects
		const email = new Email(emailValue);

		// Check if user already exists
		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new UserAlreadyExistsError(emailValue);
		}

		// Create new user (domain entity)
		const userId = this.userRepository.generateId();
		const user = User.create(userId, email, role);

		// Persist user
		await this.userRepository.save(user);

		const tokens = await this.tokenManagerService.issueTokens({
			userId: user.id,
			email: user.email.value,
			role: user.role,
		});

		// Domain events can be published here later
		// this.eventBus.publishAll(user.getDomainEvents());

		return { user, tokens };
	}
}
