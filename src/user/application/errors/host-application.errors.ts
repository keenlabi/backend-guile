import { ApplicationError } from "src/shared/errors/application.error";
import { HttpStatus } from "@nestjs/common";

export enum HostApplicationErrorCodes {
    MISSING_PROFILE = 'MISSING_PROFILE',
    MISSING_SEEKER_PROFILE = 'MISSING_SEEKER_PROFILE',
    MISSING_CULTURAL_IDENTITY = 'MISSING_CULTURAL_IDENTITY',
    ACCOUNT_TOO_NEW = 'ACCOUNT_TOO_NEW',
    PROFILE_INCOMPLETE = 'PROFILE_INCOMPLETE',
    HOST_APPLICATION_NOT_FOUND = 'HOST_APPLICATION_NOT_FOUND',
    HOST_APPLICATION_ALREADY_EXISTS = 'HOST_APPLICATION_ALREADY_EXISTS',
}

export abstract class HostApplicationError extends ApplicationError {}

export class HostApplicationAlreadyExistsError extends HostApplicationError {
    constructor() {
        super(
            `You have already submitted a host application.`,
            HttpStatus.CONFLICT,
            HostApplicationErrorCodes.HOST_APPLICATION_ALREADY_EXISTS);
        this.name = 'HostApplicationAlreadyExistsError';
    }
}

export class UserNotEligibleForHostError extends HostApplicationError {
    constructor(reason: string, errorCode: HostApplicationErrorCodes) {
        super(`User is not eligible to apply for hosting: ${reason}`, HttpStatus.FORBIDDEN, errorCode);
        this.name = 'UserNotEligibleForHostError';
    }
}

export class HostApplicationNotFoundError extends HostApplicationError {
    constructor(applicationId: string) {
        super(
            `Host application with id: '${applicationId}' not found.`, 
            HttpStatus.NOT_FOUND, 
            HostApplicationErrorCodes.HOST_APPLICATION_NOT_FOUND
        );
        this.name = 'HostApplicationNotFoundError';
    }
}
