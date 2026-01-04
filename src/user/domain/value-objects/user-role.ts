import { UserRoleType } from '../enums/user-role.enum';
import { InvalidUserRoleError } from '../errors/user.errors';

export class UserRole {
	private readonly _value: UserRoleType;

	private constructor(value: UserRoleType) {
		this._value = value;
	}

	get value(): UserRoleType {
		return this._value;
	}

	// --- Factory Method ---
	static fromString(value: string): UserRole {
        // Validate against the Enum
		const isValid = Object.values(UserRoleType).includes(value as UserRoleType);
        
		if (!isValid) {
			throw new InvalidUserRoleError(value);
		}
        
		return new UserRole(value as UserRoleType);
	}

    // --- Helper to create from Enum directly ---
    static fromEnum(value: UserRoleType): UserRole {
        return new UserRole(value);
    }

	// --- Helpers ---
	isAdmin(): boolean {
		return this._value === UserRoleType.ADMIN;
	}

	isTrader(): boolean {
		return this._value === UserRoleType.TRADER;
	}
    
    equals(other: UserRole): boolean {
        return this._value === other._value;
    }
}