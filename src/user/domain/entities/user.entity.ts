import { InvalidEmailError } from '../errors/email.errors';
import { MissingUserIdError } from '../errors/user.errors';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { UserStatus } from '../value-objects/user-status';

export class User {
	constructor(
		public readonly id: string,
		public readonly email: Email,
		public readonly role: string,
		public readonly status: UserStatus = UserStatus.ACTIVE,
		public readonly emailVerified: boolean = false,
		public readonly createdAt: Date = new Date(),
		public readonly _password?: Password | null,
	) {
		this.validateInvariants();
	}

	get passwordHash(): string | null {
		return this._password ? this._password.hash : null;
	}

	async verifyPassword(plainText: string): Promise<boolean> {
		if (!this._password) return false;
		return this._password.verify(plainText);
	}

	// ===== FACTORY METHODS =====
	static create(
		id: string,
		email: Email,
		role: string,
		status?: UserStatus,
		emailVerified?: boolean,
		createdAt?: Date,
	): User {
		const user = new User(id, email, role, status, emailVerified, createdAt);
		return user;
	}

	// For reconstructing from database
	static fromPersistence(
		id: string,
		email: Email,
		role: string,
		status: UserStatus,
		emailVerified: boolean,
		createdAt: Date,
	): User {
		return new User(id, email, role, status, emailVerified, createdAt);
	}

	// ===== PRIVATE METHODS =====x
	private validateInvariants(): void {
		if (!this.id) {
			throw new MissingUserIdError();
		}
		if (!this.email) {
			throw new InvalidEmailError();
		}
		// if (!this._password) {
		// 	throw new InvalidPasswordError();
		// }
	}
}
