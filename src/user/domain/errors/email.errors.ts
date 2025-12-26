import { DomainError } from 'src/shared/errors/domain.error';

export class EmailAlreadyVerifiedError extends DomainError {
	constructor() {
		super('Email is already verified');
	}
}

export class InvalidEmailError extends DomainError {
	constructor() {
		super('Email is required');
	}
}

export class InvalidEmailFormatError extends DomainError {
	constructor() {
		super('Invalid email format');
	}
}
