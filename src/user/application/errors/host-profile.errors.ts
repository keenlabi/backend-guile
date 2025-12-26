import { ApplicationError } from "src/shared/errors/application.error";
import { HttpStatus } from "@nestjs/common";

export enum HostProfileErrorCodes {
    HOST_PROFILE_ALREADY_EXISTS = 'HOST_PROFILE_ALREADY_EXISTS',
}

export abstract class HostProfileError extends ApplicationError {}

export class HostProfileAlreadyExistsError extends HostProfileError {
    constructor(userId: string) {
        super(
            `Host profile already exists for user ${userId}.`,
            HttpStatus.CONFLICT,
            HostProfileErrorCodes.HOST_PROFILE_ALREADY_EXISTS);
        this.name = 'HostProfileAlreadyExistsError';
    }
}