import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/shared/auth/infrastructure/guards/roles.guard'; // Add if you have roles
// import { Roles } from 'src/shared/decorators/roles.decorator';
// import { UserRoleType } from 'src/user/domain/enums/user-role.enum';
import { GetPendingKycUseCase } from '../../application/usecases/get-pending-kyc.usecase';
import { ReviewKycUseCase } from '../../application/usecases/review-kyc.usecase';
import { ReviewKycDto } from './dtos/review-kyc.dto';

@Controller('admin/kyc')
@UseGuards(JwtAuthGuard)
// @Roles(UserRoleType.ADMIN) // Uncomment to enforce Admin role
export class AdminKycController {
  constructor(
    private readonly getPendingKycUseCase: GetPendingKycUseCase,
    private readonly reviewKycUseCase: ReviewKycUseCase,
  ) {}

  @Get('pending')
  async getPending() {
    const data = await this.getPendingKycUseCase.execute();
    return { data };
  }

  @Put(':id/review')
  async review(@Param('id') id: string, @Body() dto: ReviewKycDto) {
    return await this.reviewKycUseCase.execute(id, dto.action, dto.reason);
  }
}