import { DomainError } from 'src/shared/errors/domain.error';

export class UserAlreadyDeactivatedError extends DomainError {
	constructor() {
		super('User is already deactivated');
	}
}

export class UserAlreadyActiveError extends DomainError {
	constructor() {
		super('User is already active');
	}
}

export class MissingUserIdError extends DomainError {
	constructor() {
		super('User ID is required');
	}
}

export class InvalidUserStatusError extends DomainError {
	constructor(value: string) {
		super(`Invalid user status: ${value}`);
	}
}

export class InvalidUserAgeStatusError extends DomainError {
	constructor() {
		super('User must be at least 18 years old');
	}
}
