import { DomainError } from 'src/shared/errors/domain.error';

export class InvalidPasswordHashError extends DomainError {
	constructor() {
		super('Password hash is required');
	}
}

export class InvalidPasswordError extends DomainError {
	constructor() {
		super('Password is required');
	}
}

export class WeakPasswordError extends DomainError {
	constructor() {
		super('Password must be at least 8 characters');
	}
}

export class PasswordComplexityError extends DomainError {
	constructor() {
		super('Password must contain uppercase, lowercase, and number');
	}
}
