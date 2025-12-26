import { Inject, Injectable } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { CurrentUserPayload } from 'src/shared/types/express/auth';
import * as refreshTokenRepositoryInterface from 'src/shared/auth/domain/repositories/refresh-token.repository.interface';

export interface JwtPairResponse {
	accessToken: string;
	refreshToken: string;
}

@Injectable()
export class TokenManagerService {
	constructor(
		@Inject('IRefreshTokenRepository')
		private readonly refreshTokenRepository: refreshTokenRepositoryInterface.IRefreshTokenRepository,
		private readonly jwtTokenService: JwtTokenService,
	) { }

	async issueTokens(authUser: CurrentUserPayload): Promise<JwtPairResponse> {
		const tokens = this.jwtTokenService.generateTokenPair(authUser);
		const refreshTokenExpiry = this.jwtTokenService.getRefreshTokenExpiryDate();
		await this.refreshTokenRepository.save(
			authUser.userId,
			tokens.refreshToken,
			refreshTokenExpiry,
		);
		return tokens;
	}
}
