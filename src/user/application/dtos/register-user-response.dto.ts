import { User } from 'src/user/domain/entities/user.entity';

export class RegisterUserResponseDto {
	id: string;
	email: string;
	role: string;
	emailVerified: boolean;

	static fromDomain(user: User): RegisterUserResponseDto {
		return {
			id: user.id,
			email: user.email.value,
			role: user.role.value,
			emailVerified: user.emailVerified,
		};
	}
}
