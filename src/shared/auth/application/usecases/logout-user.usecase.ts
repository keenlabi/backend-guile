import { Inject, Injectable } from '@nestjs/common';
import * as refreshTokenRepositoryInterface from 'src/shared/auth/domain/repositories/refresh-token.repository.interface';

@Injectable()
export class LogoutUserUseCase {
	constructor(
		@Inject('IRefreshTokenRepository')
		private readonly refreshTokenRepository: refreshTokenRepositoryInterface.IRefreshTokenRepository,
	) {}

	async execute(refreshToken: string): Promise<void> {
		await this.refreshTokenRepository.delete(refreshToken);
	}
}
