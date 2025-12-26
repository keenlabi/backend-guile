import { InvalidUserStatusError } from '../errors/user.errors';

export class UserStatus {
	private readonly _value: string;

	private constructor(value: string) {
		this._value = value;
	}

	get value(): string {
		return this._value;
	}

	static readonly ACTIVE = new UserStatus('active');
	static readonly SUSPENDED = new UserStatus('suspended');
	static readonly DEACTIVATED = new UserStatus('deactivated');

	static fromString(value: string): UserStatus {
		switch (value) {
			case 'active':
				return UserStatus.ACTIVE;
			case 'suspended':
				return UserStatus.SUSPENDED;
			case 'deactivated':
				return UserStatus.DEACTIVATED;
			default:
				throw new InvalidUserStatusError(
					`Invalid user status: ${value}`,
				);
		}
	}

	equals(other: UserStatus): boolean {
		return this._value === other._value;
	}

	isActive(): boolean {
		return this._value === 'active';
	}

	isDeactivated(): boolean {
		return this._value === 'deactivated';
	}
}
