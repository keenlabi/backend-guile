import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('assets')
export class AssetModel {
  @PrimaryColumn('uuid')
  id: string;

  @PrimaryColumn()
  symbol: string;

  @Column()
  name: string;

  @Column({ type: 'int', default: 8 })
  decimals: number;

  @Column({ 
    type: 'enum', 
    enum: ['crypto', 'fiat', 'stablecoin'], 
    default: 'crypto' 
  })
  type: string;

  @Column({ name: 'is_deposit_enabled', default: true })
  is_deposit_enabled: boolean;

  @Column({ name: 'is_withdrawal_enabled', default: true })
  is_withdrawal_enabled: boolean;

  @Column({ name: 'is_trading_enabled', default: true })
  is_trading_enabled: boolean;

  @Column({ name: 'icon_url', nullable: true })
  icon_url: string;
  
  @Column({ name: 'deposit_address', nullable: true })
  deposit_address: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}