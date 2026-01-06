import {
	Controller,
	HttpCode,
	HttpStatus,
	Req,
	UseGuards,
	Get,
	Param,
} from '@nestjs/common';
import express from 'express';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUserPayload } from 'src/shared/types/express/auth';
import { GetTradersUseCase } from 'src/user/application/usecases/get-traders.usecase';
import { FindUserProfileUseCase } from 'src/user/application/usecases/find-user-profile.usecase';

@Controller('profiles')
export class ProfileController {
	constructor(
		private readonly findUserProfileUseCase: FindUserProfileUseCase,
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
			profile: await this.findUserProfileUseCase.execute((req.user as CurrentUserPayload).userId),
		};
	}

	@Get(':userId')
	@UseGuards(JwtAuthGuard)
	async getUserProfile(@Param('userId') userId: string) {
		return await this.findUserProfileUseCase.execute(userId);
	}
}
