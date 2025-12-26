export type ErrorDetails = Array<{ field: string; message: string }>;

export class ApiResponse<T = any> {
	status: 'SUCCESS' | 'ERROR';
	code: number;
	message: string;
	data?: T;
	error?: ErrorDetails;
	errorCode?: string;

	constructor(
		status: 'SUCCESS' | 'ERROR',
		code: number,
		message: string,
		data?: T,
		error?: ErrorDetails,
		errorCode?: string,
	) {
		this.status = status;
		this.code = code;
		this.message = message;
		if (data) this.data = data;
		if (error) this.error = error;
		if (errorCode) this.errorCode = errorCode;
	}

	static success<T>(
		data: T,
		message: string = 'Success',
		code: number = 200,
	): ApiResponse<T> {
		return new ApiResponse('SUCCESS', code, message, data);
	}

	static error(
		message: string,
		code: number = 500,
		details?: ErrorDetails,
		errorCode?: string,
	): ApiResponse {
		return new ApiResponse('ERROR', code, message, undefined, details, errorCode);
	}
}
