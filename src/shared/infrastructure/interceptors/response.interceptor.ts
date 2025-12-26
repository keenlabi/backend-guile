import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dtos/api-repsonse.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const response = ctx.getResponse<{ statusCode: number }>();
		const request = ctx.getRequest<{ method: string }>();

		return next.handle().pipe(
			map((data) => {
				// If data is already an ApiResponse, return it
				if (data instanceof ApiResponse) {
					return data;
				}

				// If controller returned raw success data, wrap it
				const statusCode = response.statusCode || HttpStatus.OK;
				const message = this.getSuccessMessage(
					request.method,
					statusCode,
				);

				return ApiResponse.success(data, message, statusCode);
			}),
		);
	}

	private getSuccessMessage(method: string, statusCode: HttpStatus): string {
		if (statusCode === HttpStatus.CREATED) {
			return 'Resource created successfully';
		}
		if (method === 'DELETE') {
			return 'Resource deleted successfully';
		}
		if (method === 'PUT' || method === 'PATCH') {
			return 'Resource updated successfully';
		}
		return 'Success';
	}
}
