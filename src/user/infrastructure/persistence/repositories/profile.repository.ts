import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProfileModel } from '../models/profile.model';
import { Profile, ProfileUser } from '../../../domain/entities/profile.entity';
import { IProfileRepository } from '../../../domain/repositories/profile.repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleType } from 'src/user/domain/enums/user-role.enum';

@Injectable()
export class ProfileRepository implements IProfileRepository {
	constructor(
		@InjectRepository(ProfileModel)
		private readonly repository: Repository<ProfileModel>,
	) {}

	async findAllTraders(): Promise<Profile[]> {
		const profiles = await this.repository.find({
			relations: ['user'], // Perform the JOIN
			where: {
				user: {
				role: UserRoleType.TRADER as any, // Filter on the joined table
				},
			},
			order: {
				created_at: 'DESC',
			},
		});

		return profiles.map((model) => this.toDomain(model));
	}

	generateId(): string {
		return uuidv4();
	}

	async save(profile: Profile): Promise<Profile> {
		const model = this.toPersistence(profile);
		const saved = await this.repository.save(model);
		return this.toDomain(saved)
	}

	async findByUserId(userId: string): Promise<Profile | null> {
		const model = await this.repository.findOne({
			where: { user_id: userId },
			relations: ['user'],
		});
		if (!model) return null;
		return this.toDomain(model);
	}

	async findById(id: string): Promise<Profile | null> {
		const model = await this.repository.findOne({ where: { id } });
		if (!model) return null;

		return this.toDomain(model);
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}

	protected toDomain(model: ProfileModel): Profile {
		let userDomain: ProfileUser | null = null;

		if (model.user) {
			userDomain = {
				id: model.user.id,
				email: model.user.email,
				role: model.user.role,
				status: model.user.status,
				email_verified: model.user.email_verified,
				createdAt: model.user.created_at
			} as any;
		}

		return Profile.fromPersistence(
			model.id,
			model.user_id,
			model.first_name,
			model.last_name,
			model.nickname,
			model.created_at,
			model.updated_at,
			userDomain
		);
	}

	protected toPersistence(entity: Profile): ProfileModel {
		const model = new ProfileModel();
		model.id = entity.id;
		model.user_id = entity.userId;
		// Map nulls correctly
		model.first_name = entity.firstName as string; 
		model.last_name = entity.lastName as string;
		model.nickname = entity.nickname as string;
		return model;
	}
}
