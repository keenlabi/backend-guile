// import { BadRequestException } from '@nestjs/common';
// import { ValidationError } from 'class-validator';

/**
 * Formats validation errors from class-validator into a structured object.
 *
 * @param errors The array of ValidationError objects.
 * @returns A BadRequestException with a structured error message.
 */
// export function validationExceptionFactory(errors: ValidationError[]) {
// 	const formattedErrors = errors.reduce((accumulator, error) => {
// 		accumulator[error.property] = Object.values(error.constraints!);
// 		return accumulator;
// 	}, {});

// 	return new BadRequestException({
// 		message: 'Validation failed',
// 		errors: formattedErrors,
// 	});
// }

import { BadRequestException, ValidationError } from '@nestjs/common';
import { HttpErrorCode } from '../infrastructure/errors/http-error-codes.enum';

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
