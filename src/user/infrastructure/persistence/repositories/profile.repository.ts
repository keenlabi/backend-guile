import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProfileModel } from '../models/profile.model';
import { Profile } from '../../../domain/entities/profile.entity';
import { IProfileRepository } from '../../../domain/repositories/profile.repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileRepository implements IProfileRepository {
	constructor(
		@InjectRepository(ProfileModel)
		private readonly repository: Repository<ProfileModel>,
	) {}

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
			relations: ['user', 'location'],
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
		
		return Profile.fromPersistence(
			model.id,
			model.user_id,
			model.first_name,
			model.last_name,
			model.username,
			model.created_at,
			model.updated_at,
		);
	}

	protected toPersistence(entity: Profile): ProfileModel {
		const model = new ProfileModel();
		model.id = entity.id;
		model.user_id = entity.userId;
		model.username = entity.username;
		model.first_name = entity.firstName;
		model.last_name = entity.lastName;

		return model;
	}
}
