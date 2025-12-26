import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity('users')
export class UserModel {
	@PrimaryColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column({ name: 'email_verified', default: false })
	email_verified: boolean;

	role: string;
	
	@Column({
		type: 'enum',
		enum: ['active', 'suspended', 'deactivated'],
		default: 'active',
	})
	status: string;

	@Column({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	created_at: Date;

	@Column({
		name: 'updated_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updated_at: Date;
}
