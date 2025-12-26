import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { UserModel } from './user.model';

@Entity('profiles')
export class ProfileModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid', unique: true })
	user_id: string;

	@OneToOne(() => UserModel, { nullable: true })
	@JoinColumn({ name: 'user_id' })
	user?: UserModel;

	@Column({ type: 'text' })
	first_name: string;

	@Column({ type: 'text' })
	last_name: string;

	@Column({ type: 'text' })
	username: string;

	@Column({
		name: 'date_of_birth',
		type: 'timestamp',
	})
	date_of_birth: Date;

	@Column({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	created_at?: Date;

	@Column({
		name: 'updated_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updated_at?: Date;
}
