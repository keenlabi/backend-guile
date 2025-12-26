import { ErrorDetails } from '../dtos/api-repsonse.dto';
import { HttpErrorCode } from './http-error-codes.enum';

export class InfrastructureError extends Error {
	constructor(
		public readonly statusCode: number,
		public readonly message: string,
		public readonly errorCode: HttpErrorCode,
		public readonly details?: ErrorDetails,
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class BadRequestError extends InfrastructureError {
	constructor(message: string = 'Bad request', details?: any) {
		super(400, message, HttpErrorCode.BAD_REQUEST, details);
	}
}

export class UnauthorizedError extends InfrastructureError {
	constructor(message: string = 'Unauthorized') {
		super(401, message, HttpErrorCode.UNAUTHORIZED);
	}
}

export class ForbiddenError extends InfrastructureError {
	constructor(message: string = 'Forbidden') {
		super(403, message, HttpErrorCode.FORBIDDEN);
	}
}

export class NotFoundError extends InfrastructureError {
	constructor(message: string = 'Resource not found') {
		super(404, message, HttpErrorCode.NOT_FOUND);
	}
}

export class ConflictError extends InfrastructureError {
	constructor(message: string = 'Conflict') {
		super(409, message, HttpErrorCode.CONFLICT);
	}
}

export class InternalServerError extends InfrastructureError {
	constructor(message: string = 'Internal server error') {
		super(500, message, HttpErrorCode.INTERNAL_SERVER_ERROR);
	}
}
