import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from '../../../../user/infrastructure/persistence/models/user.model';
import { TransactionStatus, TransactionType } from '../../../domain/entities/transaction.entity';

@Entity('transactions')
export class TransactionModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  symbol: string;

  @Column('decimal', { precision: 18, scale: 2 })
  amount_usd: number;

  @Column('decimal', { precision: 18, scale: 8 })
  token_amount: number;

  @Column('decimal', { precision: 18, scale: 8 })
  rate_at_time: number;

  // --- NEW FIELDS ---
  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.COMPLETED })
  status: TransactionStatus;

  @Column({ name: 'tx_hash', nullable: true })
  tx_hash: string;

  @Column({ name: 'sender_address', nullable: true })
  sender_address: string;

  @Column({ nullable: true })
  network: string; // e.g. 'Bitcoin', 'ERC20'

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}