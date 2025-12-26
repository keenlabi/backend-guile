import { BadRequestException, ValidationError } from '@nestjs/common';
import { HttpErrorCode } from '../errors/http-error-codes.enum';

export class StructuredValidationException extends BadRequestException {
	constructor(public readonly errors: Record<string, string[]>) {
		super({
			message: 'Validation failed',
			errorCode: HttpErrorCode.VALIDATION_FAILED,
			errors: errors,
		});
	}
}

export function validationExceptionFactory(
	errors: ValidationError[],
): StructuredValidationException {
	const formattedErrors: Record<string, string[]> = {};
	errors.forEach((error) => {
		if (error.constraints) {
			formattedErrors[error.property] = Object.values(error.constraints);
		}
	});
	return new StructuredValidationException(formattedErrors);
}
