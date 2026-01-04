import { User } from '../../domain/entities/user.entity';

export class AuthenticateUserResponseDto {
	id: string;
	email: string;
	role: string;
	emailVerified: boolean;

	static fromDomain(user: User): AuthenticateUserResponseDto {
		return {
			id: user.id,
			email: user.email.value,
			role: user.role.value,
			emailVerified: user.emailVerified,
		};
	}
}
