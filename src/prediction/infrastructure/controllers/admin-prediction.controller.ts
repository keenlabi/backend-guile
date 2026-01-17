import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';

import { PlacePredictionUseCase } from '../../application/usecases/place-prediction.usecase';
import { CreatePredictionDto } from './dtos/create-prediction.dto';

export class AdminPlacePredictionDto extends CreatePredictionDto {
    userId: string; // Admin specifies the target user
}

@Controller('admin/predictions')
@UseGuards(JwtAuthGuard)
export class AdminPredictionController {
  constructor(
    private readonly placePredictionUseCase: PlacePredictionUseCase,
  ) {}

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