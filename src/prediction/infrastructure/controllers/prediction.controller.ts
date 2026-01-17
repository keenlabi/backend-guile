import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { PlacePredictionUseCase } from '../../application/usecases/place-prediction.usecase';
import { ResolvePredictionUseCase } from '../../application/usecases/resolve-prediction.usecase';
import { CreatePredictionDto } from './dtos/create-prediction.dto';
import { ResolvePredictionDto } from './dtos/resolve-prediction.dto';
import { CurrentUserPayload } from 'src/shared/types/express/auth';
import { GetPredictionsUseCase } from 'src/prediction/application/usecases/get-predictions.usecase';
import { GetPendingPredictionsUseCase } from 'src/prediction/application/usecases/get-pending-predictions.usecase';
import { ClosePredictionUseCase } from 'src/prediction/application/usecases/close-prediction.usecase';
import { ClosePredictionDto } from './dtos/close-prediction.dto';

@Controller('predictions')
@UseGuards(JwtAuthGuard)
export class PredictionController {
  constructor(
    private readonly placePredictionUseCase: PlacePredictionUseCase,
    private readonly resolvePredictionUseCase: ResolvePredictionUseCase,
    private readonly getPredictionsUseCase: GetPredictionsUseCase,
    private readonly getPendingPredictionsUseCase: GetPendingPredictionsUseCase,
    private readonly closePredictionUseCase: ClosePredictionUseCase,
  ) {}

  @Put(':id/close')
  async close(@Param('id') id: string, @Body() dto: ClosePredictionDto) {
    return this.closePredictionUseCase.execute(id, dto.closePrice);
  }

  @Get('admin/pending')
  async getPending() {
    return this.getPendingPredictionsUseCase.execute();
  }

  @Post()
  async place(@Req() req: any, @Body() dto: CreatePredictionDto) {
    const user = req.user as CurrentUserPayload;
    return this.placePredictionUseCase.execute(
      user.userId, dto.symbol, dto.direction, dto.amount, dto.duration
    );
  }

  // ADMIN ONLY (Add RolesGuard here in production)
  @Put(':id/resolve')
  async resolve(@Param('id') id: string, @Body() dto: ResolvePredictionDto) {
    return this.resolvePredictionUseCase.execute(id, dto.outcome, null, null, dto.payout);
  }

  @Get('me')
  async getMyActive(@Req() req: any) {
    const user = req.user as CurrentUserPayload;
    return this.getPredictionsUseCase.execute(user.userId);
  }
}