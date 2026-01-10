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

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'date' })
  dob: string; // YYYY-MM-DD

  @Column()
  country: string;

  // Storing File Paths (strings), not the files themselves
  @Column()
  document_type: string; // 'PASSPORT', 'DRIVERS_LICENSE', 'ID_CARD'

  @Column()
  document_front_url: string; // Strictly required

  // CHANGE 1: Allow null here
  @Column({ nullable: true })
  document_back_url: string | null; 

  // CHANGE 2: Allow null here
  @Column({ nullable: true })
  selfie_url: string | null;         

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  // CHANGE 3: Allow null here
  @Column({ nullable: true })
  rejection_reason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}