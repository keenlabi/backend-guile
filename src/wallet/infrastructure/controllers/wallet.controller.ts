import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GetMyWalletUseCase } from '../../application/usecases/get-my-wallet.usecase';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { WalletResponse } from 'src/wallet/application/dtos/wallet-response.dto';
import { AdminWalletActionDto } from './dtos/admin-wallet-action.dto';
import { CreditWalletUseCase } from 'src/wallet/application/usecases/credit-wallet.usecase';
import { DebitWalletUseCase } from 'src/wallet/application/usecases/debit-wallet.usecase';
import express from 'express';
import { GetPendingWithdrawalsUseCase } from 'src/wallet/application/usecases/get-pending-withdrawals.usecase';
import { ProcessWithdrawalUseCase } from 'src/wallet/application/usecases/process-withdrawal.usecase';
import { GetMyTransactionsUseCase } from 'src/wallet/application/usecases/get-my-transactions.usecase';
import { CurrentUserPayload } from 'src/shared/types/express/auth';
import { WithdrawRequestDto } from './dtos/withdraw-request.dto';
import { RequestWithdrawalUseCase } from 'src/wallet/application/usecases/request-withdrawal.usecase';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly getMyWalletUseCase: GetMyWalletUseCase,
    private readonly creditWalletUseCase: CreditWalletUseCase,
    private readonly debitWalletUseCase: DebitWalletUseCase,
    private readonly getPendingWithdrawalsUseCase: GetPendingWithdrawalsUseCase,
    private readonly processWithdrawalUseCase: ProcessWithdrawalUseCase,
    private readonly getMyTransactionsUseCase: GetMyTransactionsUseCase,
    private readonly requestWithdrawalUseCase: RequestWithdrawalUseCase
  ) {}

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Req() req: any) {
    const user = req.user as CurrentUserPayload;
    const data = await this.getMyTransactionsUseCase.execute(user.userId);
    
    return {
      success: true,
      data: data
    };
  }

  @Post('credit')
  async credit(@Req() req: express.Request, @Body() dto: AdminWalletActionDto) {
    return await this.creditWalletUseCase.execute(dto.userId, dto.symbol, dto.amountUsd);
  }

  @Post('debit')
  async debit(@Req() req: express.Request, @Body() dto: AdminWalletActionDto) {
    return await this.debitWalletUseCase.execute(dto.userId, dto.symbol, dto.amountUsd, dto.recipientAddress!);
  }

  @Post('withdraw')
  async requestWithdrawal(@Req() req: any, @Body() dto: WithdrawRequestDto) {
    const user = req.user as CurrentUserPayload;
    
    return await this.requestWithdrawalUseCase.execute(
      user.userId,
      dto.symbol,
      dto.amountUsd,
      dto.destinationAddress
    );
  }

  @Get('withdrawals/pending')
  async getPending() {
    return this.getPendingWithdrawalsUseCase.execute();
  }

  @Put('withdrawals/:id/process')
  async process(@Param('id') id: string, @Body() body: { action: 'APPROVE' | 'REJECT', txHash?: string }) {
    return this.processWithdrawalUseCase.execute(id, body.action, body.txHash);
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