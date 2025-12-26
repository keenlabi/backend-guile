import { Module } from '@nestjs/common';
import { TokenModule } from './token.module';
import { UserModule } from 'src/user/user.module';
import { LogoutUserUseCase } from 'src/shared/auth/application/usecases/logout-user.usecase';
import { AuthenticateUserUseCase } from './application/usecases/authenticate-user.usecase';
import { StrategiesModule } from './strategies.module';
import { CompleteGoogleAuthUseCase } from './application/usecases/complete-google-auth.usecase';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { ConfigService } from '@nestjs/config';
import { CookieUtils } from './infrastructure/utils/cookie.utils';
import { InitiateGoogleAuthUseCase } from './application/usecases/initiate-google-auth.usecase';
import { RefreshTokenRepository } from './infrastructure/persistence/repositories/refresh-token.repository';
 
  @Module({
    imports: [
      TokenModule,
      StrategiesModule,
      UserModule,
    ],
    controllers: [AuthController],
    providers: [
      LogoutUserUseCase,
      AuthenticateUserUseCase,
      CompleteGoogleAuthUseCase,
      ConfigService,
      CookieUtils,
      InitiateGoogleAuthUseCase,
      
      {
        provide: 'IRefreshTokenRepository',
        useClass: RefreshTokenRepository,
      },
    ],
    exports: [
      LogoutUserUseCase,
      'IRefreshTokenRepository',
    ],
  })
 
 export class AuthModule {}
