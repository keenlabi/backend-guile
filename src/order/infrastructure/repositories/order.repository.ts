import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderModel } from '../models/order.model';
import { Order, OrderSide, OrderStatus } from '../../../wallet/domain/entities/order.entity';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

@Injectable()
export class OrderRepository extends BaseRepository<Order, OrderModel> {
  constructor(
    @InjectRepository(OrderModel)
    readonly repository: Repository<OrderModel>,
  ) {
    super(repository);
  }

  protected toDomain(model: OrderModel): Order {
    return new Order(
      model.id,
      model.user_id,
      model.symbol,
      model.side,
      Number(model.quantity),
      Number(model.price),
      Number(model.total_usd),
      model.status,
      model.created_at,
    );
  }

  protected toPersistence(entity: Order): OrderModel {
    const model = new OrderModel();
    model.id = entity.id;
    model.user_id = entity.userId;
    model.symbol = entity.symbol;
    model.side = entity.side;
    model.quantity = entity.quantity;
    model.price = entity.price;
    model.total_usd = entity.totalUsd;
    model.status = entity.status;
    return model;
  }
}