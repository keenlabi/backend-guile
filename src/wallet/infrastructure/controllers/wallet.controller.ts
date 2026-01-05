import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetMyWalletUseCase } from '../../application/usecases/get-my-wallet.usecase';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { WalletResponse } from 'src/wallet/application/dtos/wallet-response.dto';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly getMyWalletUseCase: GetMyWalletUseCase) {}

  @Get('me')
  async getMyWallet(@Req() req: any): Promise<WalletResponse> {
    const data = await this.getMyWalletUseCase.execute(req.user.userId);
    console.log(data)
    return data
  }
}