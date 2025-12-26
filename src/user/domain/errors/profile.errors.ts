import { DomainError } from 'src/shared/errors/domain.error';

export class ProfileAlreadyExistsError extends DomainError {
	constructor(message?: string) {
		super(message ?? `Profile already exists`);
	}
}
