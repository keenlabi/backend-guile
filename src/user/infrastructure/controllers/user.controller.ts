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
	Put,
} from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/usecases/register-user.usecase';
import { RegisterUserRequestDto } from './dtos/register-user-request.dto';
import express from 'express';
import { CookieUtils } from '../../../shared/auth/infrastructure/utils/cookie.utils';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUserPayload } from 'src/shared/types/express/auth';
import { FindUserUseCase } from 'src/user/application/usecases/find-user.usecase';
import { GetTradersUseCase } from 'src/user/application/usecases/get-traders.usecase';
import { ToggleManagedModeUseCase } from 'src/user/application/usecases/toggle-managed-mode.usecase';

@Controller('users')
export class UserController {
	constructor(
		private readonly registerUserUseCase: RegisterUserUseCase,
		private readonly findUserUseCase: FindUserUseCase,
		private readonly getTradersUseCase: GetTradersUseCase,
		private readonly cookieUtils: CookieUtils,
		private readonly toggleManagedModeUseCase: ToggleManagedModeUseCase
	) {}

	@Put('managed-mode')
	@UseGuards(JwtAuthGuard)
	async toggleManagedMode(@Req() req: any, @Body() body: { enable: boolean }) {
		return await this.toggleManagedModeUseCase.execute(
			req.user.userId, 
			body.enable
		);
	}

	@Get('traders')
	@UseGuards(JwtAuthGuard)
	async getTraders() {
		return await this.getTradersUseCase.execute();
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	async getProfile(@Req() req: express.Request) {
		const user = await this.findUserUseCase.execute((req.user as CurrentUserPayload).userId);
		return user;
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
