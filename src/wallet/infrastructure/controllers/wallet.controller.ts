import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { GetMyWalletUseCase } from '../../application/usecases/get-my-wallet.usecase';
import { DepositFundsUseCase } from '../../application/usecases/deposit-funds.usecase';
import { DepositRequestDto } from './dtos/deposit-request.dto';
import express from 'express';
import { CurrentUserPayload } from 'src/shared/types/express/auth';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly getMyWalletUseCase: GetMyWalletUseCase,
    private readonly depositFundsUseCase: DepositFundsUseCase,
  ) {}

  @Get('me')
  async getMyWallet(@Req() req: express.Request) {
    const user = req.user as CurrentUserPayload;
    const wallet = await this.getMyWalletUseCase.execute(user.userId);
    return {
      id: wallet.id,
      balance: wallet.balance,
      assets: wallet.assets,
    };
  }

  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  async deposit(@Req() req: express.Request, @Body() dto: DepositRequestDto) {
    const user = req.user as CurrentUserPayload;
    const wallet = await this.depositFundsUseCase.execute(user.userId, dto.amount);
    return {
      message: 'Deposit successful',
      balance: wallet.balance,
    };
  }
}