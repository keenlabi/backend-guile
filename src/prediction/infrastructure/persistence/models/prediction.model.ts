import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from '../../../../user/infrastructure/persistence/models/user.model';
import { PredictionDirection, PredictionResult, PredictionStatus } from '../../../domain/entities/prediction.entity';

@Entity('predictions')
export class PredictionModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  symbol: string;

  @Column({ type: 'enum', enum: PredictionDirection })
  direction: PredictionDirection;

  @Column('decimal', { precision: 18, scale: 2 })
  investment: number;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expires_at: Date;

  @Column('decimal', { precision: 18, scale: 2 })
  open_price: number;

  @Column('decimal', { precision: 18, scale: 2, nullable: true })
  close_price: number;

  @Column({ type: 'enum', enum: PredictionResult, nullable: true })
  result: PredictionResult;

  @Column('decimal', { precision: 18, scale: 2, nullable: true })
  payout: number;

  @Column({ type: 'enum', enum: PredictionStatus, default: PredictionStatus.PENDING })
  status: PredictionStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;
}