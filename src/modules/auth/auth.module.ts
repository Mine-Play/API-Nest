import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthConfirmController } from './auth-confirmation.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtAccess } from '../../helpers/keystore.helper';
import { ConfigModule } from '@nestjs/config';
import { VerifyModule } from '../verify/verify.module';
import { WalletsModule } from '../wallets/wallets.module';


@Module({
  imports: [
    ConfigModule.forRoot(),    
    UsersModule,
    SessionsModule,
    VerifyModule,
    WalletsModule,
    JwtModule.register({
      global: true,
      privateKey: {
        key: JwtAccess.private,
        passphrase: process.env.JWT_PASSPHRASE
      },
      publicKey: JwtAccess.public,
      signOptions: { expiresIn: '60m', algorithm: 'RS256' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController, AuthConfirmController],
  exports: [AuthService],
})
export class AuthModule {}