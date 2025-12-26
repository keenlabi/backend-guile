import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtTokenService } from './infrastructure/services/jwt.service';
import { TokenManagerService } from './infrastructure/services/token-manager.service';
import { CookieUtils } from 'src/shared/auth/infrastructure/utils/cookie.utils';
import { RefreshTokenRepository } from './infrastructure/persistence/repositories/refresh-token.repository';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.get<string>('JWT_ACCESS_EXPIRATION')!,
            10,
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtTokenService,
    TokenManagerService,
    CookieUtils,
    { provide: 'IRefreshTokenRepository', useClass: RefreshTokenRepository },
  ],
  exports: [
    JwtTokenService,
    TokenManagerService,
    CookieUtils,
    'IRefreshTokenRepository',
  ],
})
export class TokenModule {}