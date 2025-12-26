import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';
import { User } from 'src/user/domain/entities/user.entity';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from 'src/user/domain/value-objects/email';
import { UserStatus } from 'src/user/domain/value-objects/user-status';
import { UserModel } from '../models/user.model';
import { UserAlreadyExistsError } from 'src/user/application/errors/user.errors';

@Injectable()
export class UserRepository
	extends BaseRepository<User, UserModel>
	implements IUserRepository
{
	constructor(
		@InjectRepository(UserModel)
		private readonly userRepository: Repository<UserModel>
	) {
		super(userRepository);
	}

	async save(entity: User): Promise<User> {
		const existingModel = await this.userRepository.findOne({
			where: {
				email: entity.email.value,
			},
		});

		if (existingModel) throw new UserAlreadyExistsError(existingModel.email);

		const userModel = this.userRepository.create({
			id: entity.id,
			email: entity.email.value,
			email_verified: entity.emailVerified,
			status: entity.status.value,
		});

		const savedUserModel = await this.userRepository.save(userModel);

		const completeUserModel = await this.userRepository.findOne({
			where: { id: savedUserModel.id },
			relations: ['userRoles', 'userRoles.role'],
		});

		return this.toDomain(completeUserModel!);
	}

	async findByEmail(email: Email): Promise<User | null> {
		const model = await this.repository.findOne({
			where: { email: email.value },
		});

		if (!model) return null;

		return this.toDomain(model);
	}

	async existsByEmail(email: Email): Promise<boolean> {
		const count = await this.repository.count({
			where: { email: email.value },
		});
		return count > 0;
	}

	// ===== MAPPERS =====
	protected toDomain(model: UserModel): User {
		const email = new Email(model.email);
		const role = model.role;
		const status = UserStatus.fromString(model.status);

		return User.fromPersistence(
			model.id,
			email,
			model.role,
			status,
			model.email_verified,
			model.created_at,
		);
	}

	protected toPersistence(entity: User): UserModel {
		const model = new UserModel();
		model.id = entity.id;
		model.email = entity.email.value;
		model.email_verified = entity.emailVerified;
		model.status = entity.status.value;

		return model;
	}
}
