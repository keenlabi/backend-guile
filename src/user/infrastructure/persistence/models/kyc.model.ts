import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserModel } from './user.model';

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('kyc_records')
export class KycRecordModel {
  @PrimaryColumn('uuid')
  id: string;

  // FIX: Removed 'unique: true' (The OneToOne relation below already creates a unique index)
  @Column({ type: 'uuid' }) 
  user_id: string;

  @OneToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'date' })
  dob: string;

  @Column()
  country: string;

  @Column()
  document_type: string;

  @Column()
  document_front_url: string;

  // REQUIRED: Back to simple string
  @Column() 
  document_back_url: string; 

  // REQUIRED: Back to simple string
  @Column()
  selfie_url: string;         

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  // Rejection reason remains nullable (it's empty until rejected)
  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}