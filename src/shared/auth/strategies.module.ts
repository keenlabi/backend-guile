import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { GoogleStrategy } from 'src/shared/auth/infrastructure/strategies/google.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ConfigModule],
  // providers: [GoogleStrategy],
  providers: [],
  exports: [],
})
export class StrategiesModule {}