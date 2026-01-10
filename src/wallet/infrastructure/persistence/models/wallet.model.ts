import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { UserModel } from '../../../../user/infrastructure/persistence/models/user.model';

@Entity('wallets')
export class WalletModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ 
    type: 'decimal', 
    precision: 18, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  balance: number; // USD Fiat Balance

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}