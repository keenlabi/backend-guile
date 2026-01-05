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
import { GetTradersUseCase } from 'src/user/application/usecases/get-traders.usecase';

@Controller('profiles')
export class ProfileController {
	constructor(
		private readonly findUserGeneralProfileUseCase: FindUserGeneralProfileUseCase,
		private readonly getTradersUseCase: GetTradersUseCase,
	) {}

	@Get('traders')
	@UseGuards(JwtAuthGuard)
	async getTraders() {
		const data = await this.getTradersUseCase.execute();
		return data;
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	async getProfile(@Req() req: express.Request) {
		return {
			profile: await this.findUserGeneralProfileUseCase.execute((req.user as CurrentUserPayload).userId),
		};
	}
}
