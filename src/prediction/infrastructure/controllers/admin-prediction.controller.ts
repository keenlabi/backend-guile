import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';

import { PlacePredictionUseCase } from '../../application/usecases/place-prediction.usecase';
import { CreatePredictionDto } from './dtos/create-prediction.dto';
import { GetPredictionsUseCase } from 'src/prediction/application/usecases/get-predictions.usecase';
import { IsString } from 'class-validator';

export class AdminPlacePredictionDto extends CreatePredictionDto {
  @IsString()
  userId: string;
}

@Controller('admin/predictions')
@UseGuards(JwtAuthGuard)
export class AdminPredictionController {
  constructor(
    private readonly placePredictionUseCase: PlacePredictionUseCase,
    private readonly getPredictionsUseCase: GetPredictionsUseCase
  ) {}

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    const data = await this.getPredictionsUseCase.execute(userId);
    return data;
  }

  @Post('place')
  async placeForUser(@Body() dto: AdminPlacePredictionDto) {
    // We pass 'true' as the last argument to bypass the "isManaged" check
    // because this is an Admin/System action.
    return this.placePredictionUseCase.execute(
      dto.userId, 
      dto.symbol, 
      dto.direction, 
      dto.amount, 
      dto.duration,
      true // <--- isSystemOverride = true
    );
  }
}