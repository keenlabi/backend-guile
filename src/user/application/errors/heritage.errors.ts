import { HttpStatus } from '@nestjs/common';
import { ApplicationError } from 'src/shared/errors/application.error';

export enum HeritageApplicationErrorCodes {
    HERITAGE_NOT_FOUND = 'HERITAGE_NOT_FOUND'
}

export class HeritageNotFoundError extends ApplicationError {
    constructor(heritageId: string) {
        super(
            `Heritage not found: ${heritageId}`,
            HttpStatus.NOT_FOUND,
            HeritageApplicationErrorCodes.HERITAGE_NOT_FOUND
        );
    }
}