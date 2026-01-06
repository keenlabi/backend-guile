import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from '../../../../user/infrastructure/persistence/models/user.model';

@Entity('transactions')
export class TransactionModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  type: string; // CREDIT or DEBIT

  @Column()
  symbol: string;

  @Column('decimal', { precision: 18, scale: 2 })
  amount_usd: number;

  @Column('decimal', { precision: 18, scale: 8 })
  token_amount: number;

  @Column('decimal', { precision: 18, scale: 8 })
  rate_at_time: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}