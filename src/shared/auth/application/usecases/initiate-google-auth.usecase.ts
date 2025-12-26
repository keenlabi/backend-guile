import { Injectable } from '@nestjs/common';

@Injectable()
export class InitiateGoogleAuthUseCase {
    constructor() {}

    async execute(): Promise<void> {
        // This use case is a placeholder for the business logic of initiating
        // a Google login. In this simple case, the logic is handled entirely
        // by the Passport Guard in the controller, so this method is empty.
        // It's here to maintain architectural consistency.
        return;
    }
}