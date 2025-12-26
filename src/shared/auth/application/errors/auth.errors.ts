import { HttpStatus } from "@nestjs/common";
import { ApplicationError } from "src/shared/errors/application.error";

enum AuthApplicationErrorCode {
    USER_NOT_AUTHORIZED = 'USER_NOT_AUTHORIZED',
}

class AuthApplicationError extends ApplicationError {}

export class UserNotAuthorizedError extends AuthApplicationError {
	constructor(message?: string) {
		super(
            message ?? "Unauthorized",
            HttpStatus.UNAUTHORIZED,
            AuthApplicationErrorCode.USER_NOT_AUTHORIZED,
        );
	}
}