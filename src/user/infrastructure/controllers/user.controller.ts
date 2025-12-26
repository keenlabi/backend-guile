import {
	Controller,
	Post,
	Body,
	HttpCode,
	HttpStatus,
	Res,
	Req,
	UseGuards,
	Get,
} from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/usecases/register-user.usecase';
import { RegisterUserRequestDto } from './dtos/register-user-request.dto';
import express from 'express';
import { CookieUtils } from '../../../shared/auth/infrastructure/utils/cookie.utils';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUserPayload } from 'src/shared/types/express/auth';
import { FindUserGeneralProfileUseCase } from 'src/user/application/usecases/find-user-general-profile.usecase';

@Controller('users')
export class UserController {
	constructor(
		private readonly registerUserUseCase: RegisterUserUseCase,
		private readonly findUserGeneralProfileUseCase: FindUserGeneralProfileUseCase,
		private readonly cookieUtils: CookieUtils,
	) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	async getProfile(@Req() req: express.Request) {
		return {
			profile: await this.findUserGeneralProfileUseCase.execute((req.user as CurrentUserPayload).userId),
		};
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(
		@Body() dto: RegisterUserRequestDto,
		@Res({ passthrough: true }) res: express.Response,
	) {
		const result = await this.registerUserUseCase.execute(
			dto.email,
			dto.password
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
}
