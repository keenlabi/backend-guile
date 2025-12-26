import { Injectable } from '@nestjs/common';
import { JwtPairResponse, TokenManagerService } from 'src/shared/auth/infrastructure/services/token-manager.service';
import { CurrentUserPayload } from 'src/shared/types/express/auth';
import { User } from 'src/user/domain/entities/user.entity';

@Injectable()
export class CompleteGoogleAuthUseCase {
    constructor(private readonly tokenManagerService: TokenManagerService) {}

    async execute(authUser: CurrentUserPayload): Promise<JwtPairResponse> {
        // This use case is responsible for what happens after Google auth,
        // which is primarily issuing tokens.
        const tokens = await this.tokenManagerService.issueTokens(authUser);
        return tokens;
    }
}