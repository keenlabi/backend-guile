import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieUtils {
	constructor(private readonly configService: ConfigService) {}

	getAccessTokenOptions(): CookieOptions {
		const expiresInSeconds = parseInt(
			this.configService.get<string>('JWT_ACCESS_EXPIRATION')!,
			10,
		);
		return {
			httpOnly: true,
			secure: this.configService.get<string>('NODE_ENV') === 'production',
			sameSite: 'strict',
			maxAge: expiresInSeconds * 1000,
		};
	}

	getRefreshTokenOptions(): CookieOptions {
		const expiresInSeconds = parseInt(
			this.configService.get<string>('JWT_REFRESH_EXPIRATION')!,
			10,
		);
		return {
			httpOnly: true,
			secure: this.configService.get<string>('NODE_ENV') === 'production',
			sameSite: 'strict',
			maxAge: expiresInSeconds * 1000,
		};
	}
}
