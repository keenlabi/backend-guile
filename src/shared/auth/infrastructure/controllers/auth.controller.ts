import {
	Controller,
	Post,
	Body,
	HttpCode,
	HttpStatus,
	Res,
	Req,
	Get,
	UseGuards,
} from '@nestjs/common';
import { AuthenticateUserUseCase } from '../../application/usecases/authenticate-user.usecase';
import { LoginRequestDto } from '../../../../user/infrastructure/controllers/dtos/login-request.dto';
import express from 'express';
import { CookieUtils } from '../utils/cookie.utils';
import { LogoutUserUseCase } from 'src/shared/auth/application/usecases/logout-user.usecase';
import { ApiResponse } from 'src/shared/infrastructure/dtos/api-repsonse.dto';
import { AuthGuard } from '@nestjs/passport';
import { InitiateGoogleAuthUseCase } from 'src/shared/auth/application/usecases/initiate-google-auth.usecase';
import { CompleteGoogleAuthUseCase } from 'src/shared/auth/application/usecases/complete-google-auth.usecase';
import { ConfigService } from '@nestjs/config';
import { CurrentUserPayload } from 'src/shared/types/express/auth';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authenticateUserUseCase: AuthenticateUserUseCase,
		private readonly completeGoogleAuthUseCase: CompleteGoogleAuthUseCase,
		private readonly logoutUserUseCase: LogoutUserUseCase,
		private readonly configService: ConfigService,
		private readonly cookieUtils: CookieUtils,
		private readonly initiateGoogleAuthUseCase: InitiateGoogleAuthUseCase,
	) {}
	
	// 1. Endpoint to START the Google login process
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // The AuthGuard will automatically redirect the user to Google.
        // This code will not be executed.
        await this.initiateGoogleAuthUseCase.execute();
    }

    // 2. Endpoint for the Google CALLBACK
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(
		@Req() req: express.Request,
		@Res() res: express.Response,
	) {
        // The AuthGuard handles the callback and attaches the user to req.user.
        // Here, you would call another use case, e.g., "CompleteGoogleAuthUseCase",
        // which would be responsible for issuing your JWTs.
        const user = req.user as CurrentUserPayload;
        const tokens = await this.completeGoogleAuthUseCase.execute(user);

        res.cookie(
			'accessToken',
			tokens.accessToken,
			this.cookieUtils.getAccessTokenOptions(),
		);
		res.cookie(
			'refreshToken',
			tokens.refreshToken,
			this.cookieUtils.getRefreshTokenOptions(),
		);

		// const frontendUrl = this.configService.get('FRONTEND_URL');
		// res.redirect(`${frontendUrl}/home`);
    }

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() dto: LoginRequestDto,
		@Res({ passthrough: true }) res: express.Response,
	) {
		const result = await this.authenticateUserUseCase.execute(
			dto.email,
			dto.password,
		);

		const user = result.user;

		res.cookie(
			'accessToken',
			result.tokens.accessToken,
			this.cookieUtils.getAccessTokenOptions(),
		);
		res.cookie(
			'refreshToken',
			result.tokens.refreshToken,
			this.cookieUtils.getRefreshTokenOptions(),
		);

		return {
			user: {
				id: user.id,
				email: user.email.value,
				role: user.role,
				emailVerified: user.emailVerified,
			},
		};
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(
		@Req() req: express.Request,
		@Res({ passthrough: true }) res: express.Response,
	) {
		const cookies = req.cookies as { refreshToken?: string } | undefined;
		const refreshToken = cookies?.refreshToken;

		if (refreshToken) {
			await this.logoutUserUseCase.execute(refreshToken);
		}

		// Clear cookies
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');

		return new ApiResponse(
			'SUCCESS',
			HttpStatus.OK,
			'Logged out successfully',
		);
	}
}
