import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { GetMyWalletUseCase } from '../../application/usecases/get-my-wallet.usecase';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { WalletResponse } from 'src/wallet/application/dtos/wallet-response.dto';
import { AdminWalletActionDto } from './dtos/admin-wallet-action.dto';
import { CreditWalletUseCase } from 'src/wallet/application/usecases/credit-wallet.usecase';
import { DebitWalletUseCase } from 'src/wallet/application/usecases/debit-wallet.usecase';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly getMyWalletUseCase: GetMyWalletUseCase,
    private readonly creditWalletUseCase: CreditWalletUseCase,
    private readonly debitWalletUseCase: DebitWalletUseCase,
  ) {}

  @Post('credit')
  async credit(@Body() dto: AdminWalletActionDto) {
    return await this.creditWalletUseCase.execute(dto.userId, dto.symbol, dto.amountUsd);
  }

  @Post('debit')
  async debit(@Body() dto: AdminWalletActionDto) {
    return await this.debitWalletUseCase.execute(dto.userId, dto.symbol, dto.amountUsd);
  }

  @Get('me')
  async getMyWallet(@Req() req: any): Promise<WalletResponse> {
    const data = await this.getMyWalletUseCase.execute(req.user.userId);
    return data
  }

  @Get('/:userId')
  async getUserWallet(@Param('userId') userId: string): Promise<WalletResponse> {
    const res = await this.getMyWalletUseCase.execute(userId);
    return res
  }
}