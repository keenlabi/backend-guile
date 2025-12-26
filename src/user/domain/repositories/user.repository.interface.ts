import { IBaseRepository } from 'src/shared/domain/repositories/base.repository.interface';
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email';

export interface IUserRepository extends IBaseRepository<User> {
	findByEmail(email: Email): Promise<User | null>;
	existsByEmail(email: Email): Promise<boolean>;
	save(entity: User): Promise<User>;
}
