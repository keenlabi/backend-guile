import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenService } from '../services/jwt.service';
import { UnauthorizedError } from 'src/shared/infrastructure/errors/http.errors';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwtTokenService: JwtTokenService) {}

	canActivate(context: ExecutionContext): boolean {
		const request: Request = context.switchToHttp().getRequest();
		const token: string = request.cookies['accessToken'];
		if (!token) {
			throw new UnauthorizedError('Authentication failed: missing or expired access token.');
		}

		try {
			const payload = this.jwtTokenService.verifyAccessToken(token) as {
				sub: string;
				email: string;
				role: string;
				type: 'access' | 'refresh';
			};

			if (payload.type !== 'access') {
				throw new UnauthorizedError('Authentication failed: Invalid token type.');
			}

			request.user =  {
				userId: payload.sub,
				email: payload.email,
				role: payload.role,
			};

			return true;
		} catch (e) {
			throw new UnauthorizedError('Authentication failed: missing or expired access token.');
		}
	}
}
