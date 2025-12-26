import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/user/domain/value-objects/jwt-payload';
import { DateUtils } from 'src/shared/infrastructure/utils/date.utils';
import { CurrentUserPayload } from 'src/shared/types/express/auth';

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

@Injectable()
export class JwtTokenService {
	constructor(
		private readonly jwtService: NestJwtService,
		private readonly configService: ConfigService,
	) {}

	generateAccessToken(user: CurrentUserPayload): string {
		const payload = {
			sub: user.userId,
			email: user.email,
			role: user.role,
			type: 'access',
		};

		return this.jwtService.sign(payload);
	}

	generateRefreshToken(user: CurrentUserPayload): string {
		const payload = {
			sub: user.userId,
			email: user.email,
			role: user.role,
			type: 'refresh',
		};

		const secret = this.configService.get<string>('JWT_REFRESH_SECRET')!;
		const expiresIn = parseInt(
			this.configService.get<string>('JWT_REFRESH_EXPIRATION')!,
			10,
		);

		return this.jwtService.sign(payload, { secret, expiresIn });
	}

	generateTokenPair(user: CurrentUserPayload): TokenPair {
		return {
			accessToken: this.generateAccessToken(user),
			refreshToken: this.generateRefreshToken(user),
		};
	}

	verifyAccessToken(token: string): JwtPayload {
		return this.jwtService.verify(token);
	}

	verifyRefreshToken(token: string): JwtPayload {
		const secret = this.configService.get<string>('JWT_REFRESH_SECRET')!;
		return this.jwtService.verify(token, { secret });
	}

	getAccessTokenExpiryDate(): Date {
		const expiresInSeconds = parseInt(
			this.configService.get<string>('JWT_ACCESS_EXPIRATION')!,
			10,
		);
		return DateUtils.addSeconds(expiresInSeconds);
	}

	getRefreshTokenExpiryDate(): Date {
		const expiresInSeconds = parseInt(
			this.configService.get<string>('JWT_REFRESH_EXPIRATION')!,
			10,
		);
		return DateUtils.addSeconds(expiresInSeconds);
	}
}
