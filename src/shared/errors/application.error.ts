import { HttpStatus } from '@nestjs/common';

export abstract class ApplicationError extends Error {
	public readonly statusCode: number;
	public readonly errorCode?: string;

	protected constructor(
		message: string,
		statusCode: number = HttpStatus.BAD_REQUEST,
		errorCode?: string,
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.errorCode = errorCode;
	}
}
