import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from '../../../../user/infrastructure/persistence/models/user.model';
import { OrderSide, OrderStatus } from '../../../domain/entities/order.entity';

@Entity('orders')
export class OrderModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  symbol: string;

  @Column({ type: 'enum', enum: OrderSide })
  side: OrderSide;

  @Column('decimal', { precision: 18, scale: 8 })
  quantity: number;

  @Column('decimal', { precision: 18, scale: 2 })
  price: number;

  @Column('decimal', { precision: 18, scale: 2 })
  total_usd: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.FILLED })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}