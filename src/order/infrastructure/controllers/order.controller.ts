import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUserPayload } from 'src/shared/types/express/auth';
import { PlaceOrderDto } from './dtos/place-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor() {}

  @Post()
  async placeOrder(@Req() req: any, @Body() dto: PlaceOrderDto) {
    // const user = req.user as CurrentUserPayload;
    // // We assume the frontend sends 'amount' as the USD value they want to invest/divest
    // return this.placeOrderUseCase.execute(
    //   user.userId, 
    //   dto.symbol, 
    //   dto.side, 
    //   dto.amountUsd
    // );
  }
}