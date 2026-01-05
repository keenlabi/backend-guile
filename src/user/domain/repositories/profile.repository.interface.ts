import { Profile } from '../entities/profile.entity';

export interface IProfileRepository {
	generateId(): string;
	save(profile: Profile): Promise<Profile>;
	findByUserId(userId: string): Promise<Profile | null>;
	findById(id: string): Promise<Profile | null>;
	delete(id: string): Promise<void>;
	findAllTraders(): Promise<Profile[]>;
}
