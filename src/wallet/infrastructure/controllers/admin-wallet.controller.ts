import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreditWalletUseCase } from '../../application/usecases/credit-wallet.usecase';
import { DebitWalletUseCase } from '../../application/usecases/debit-wallet.usecase';
import { AdminWalletActionDto } from './dtos/admin-wallet-action.dto';
// Assuming you will implement an AdminGuard later or use existing AuthGuard + Role check
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/shared/auth/infrastructure/guards/roles.guard';
// import { Roles } from 'src/shared/decorators/roles.decorator';
// import { UserRoleType } from 'src/user/domain/enums/user-role.enum';

@Controller('admin/wallets')
@UseGuards(JwtAuthGuard) 
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRoleType.ADMIN)
export class AdminWalletController {
  constructor(
    private readonly creditWalletUseCase: CreditWalletUseCase,
    private readonly debitWalletUseCase: DebitWalletUseCase,
  ) {}
}