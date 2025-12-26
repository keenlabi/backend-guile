import bcrypt from 'bcrypt';
import {
	InvalidPasswordError,
	InvalidPasswordHashError,
	PasswordComplexityError,
	WeakPasswordError,
} from '../errors/password.errors';

export class Password {
	private readonly _hash: string;

	private constructor(hash: string) {
		this._hash = hash;
	}

	get hash(): string {
		return this._hash;
	}

	static async fromPlainText(plainText: string): Promise<Password> {
		this.validatePlainText(plainText);
		const hash = await bcrypt.hash(plainText, 12);
		return new Password(hash);
	}

	// Factory method for creating from existing hash (from database)
	static fromHash(hash: string): Password {
		if (!hash) {
			throw new InvalidPasswordHashError();
		}
		return new Password(hash);
	}

	async verify(plainText: string): Promise<boolean> {
		return bcrypt.compare(plainText, this._hash);
	}

	private static validatePlainText(password: string): void {
		if (!password) {
			throw new InvalidPasswordError();
		}
		if (password.length < 8) {
			throw new WeakPasswordError();
		}
		if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
			throw new PasswordComplexityError();
		}
	}
}
