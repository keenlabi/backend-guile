import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
	HttpException,
	Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../errors/domain.error';
import { ApplicationError } from '../../errors/application.error';
import { ApiResponse } from '../dtos/api-repsonse.dto';
import { InfrastructureError } from '../errors/http.errors';
import { HttpErrorCode } from '../errors/http-error-codes.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  	private readonly logger = new Logger(GlobalExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		let apiResponse: ApiResponse;

		// Domain Errors - inline (simple one-liner)
		if (exception instanceof DomainError) {
			apiResponse = this.handleDomainError(exception);
		}
		// Application Errors - use mapper (complex structure)
		else if (exception instanceof ApplicationError) {
			apiResponse = this.handleApplicationError(exception);
		}
		// Infrastructure Errors - use mapper (complex structure)
		else if (exception instanceof InfrastructureError) {
			apiResponse = this.handleInfrastructureError(exception);
		}
		// NestJS Exceptions - inline (framework-specific)
		else if (exception instanceof HttpException) {
			apiResponse = this.handleHttpException(exception);
		}
		// Unknown Errors
		else {
			this.logger.error(
				`Unhandled exception: ${exception}`, 
				exception instanceof Error ? exception.stack : undefined
			);
			
			apiResponse = ApiResponse.error(
				'An unexpected error occurred',
				HttpStatus.INTERNAL_SERVER_ERROR,
				undefined,
				HttpErrorCode.INTERNAL_SERVER_ERROR,
			);
		}

		response.status(apiResponse.code).json(apiResponse);
	}

	private handleDomainError(error: ApplicationError): ApiResponse {
		// console.log("Domain Error", error);
		return ApiResponse.error(
			error.message,
			error.statusCode,
			undefined,
			error.errorCode,
		);
	}

	private handleApplicationError(error: ApplicationError): ApiResponse {
		// console.log("Application Error", error);
		return ApiResponse.error(
			error.message,
			error.statusCode,
			undefined,
			error.errorCode,
		);
	}

	private handleInfrastructureError(error: InfrastructureError): ApiResponse {
		// console.log(error);
		return ApiResponse.error(
			error.message,
			error.statusCode,
			error.details,
			error.errorCode,
		);
	}

	private handleHttpException(exception: HttpException): ApiResponse {
		// console.log(exception)
		// console.log("HTTP: ", exception);
		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		// Handle structured errors from ValidationPipe or other custom HttpExceptions
		if (
			typeof exceptionResponse === 'object' &&
			exceptionResponse !== null &&
			'errorCode' in exceptionResponse
		) {
			const structuredResponse = exceptionResponse as {
				message: string;
				errors?: any; // errors might not always be present
				errorCode: HttpErrorCode;
			};

			return ApiResponse.error(
				structuredResponse.message,
				status,
				structuredResponse.errors, // This will now contain the detailed validation messages
				structuredResponse.errorCode,
			);
		}

		// Handle generic or non-structured HttpExceptions
		const message = typeof exceptionResponse === 'string'
						? exceptionResponse
						: (exceptionResponse as any)?.message || exception.message;

		return ApiResponse.error(message, status);
	}
}