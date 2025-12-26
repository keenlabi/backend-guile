import { HttpStatus } from '@nestjs/common';
import { ApplicationError } from 'src/shared/errors/application.error';

export class UserAlreadyExistsError extends ApplicationError {
	constructor(email: string) {
		super(`User with email ${email} already exists`, HttpStatus.CONFLICT);
	}
}

export class InvalidCredentialsError extends ApplicationError {
	constructor(specificMessage?: string) {
		super(specificMessage?.trim() ?? `Invalid email or password.`.trim(), HttpStatus.UNAUTHORIZED);
	}
}

export class UserNotFoundError extends ApplicationError {
	constructor(message?: string) {
		super(message ?? 'User not found', HttpStatus.NOT_FOUND);
	}
}
