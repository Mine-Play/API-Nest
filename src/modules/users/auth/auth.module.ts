import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthConfirmController } from './auth-confirmation.controller';
import { JwtAccess } from '../../../helpers/keystore.helper';
import { ConfigModule } from '@nestjs/config';
import { VerifyModule } from '../../verify/verify.module';
import { WalletsModule } from '../../wallets/wallets.module';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProvider } from './auth.provider.entity';
import { GoogleProvider } from 'src/services/authProviders/google.provider';


@Module({
  imports: [
    ConfigModule.forRoot(),    
    UsersModule,
    VerifyModule,
    WalletsModule,
    TypeOrmModule.forFeature([ AuthProvider ]),
    JwtModule.register({
      global: true,
      privateKey: {
        key: JwtAccess.private,
        passphrase: process.env.JWT_PASSPHRASE
      },
      publicKey: JwtAccess.public,
      signOptions: { expiresIn: '60m', algorithm: 'RS256' },
    }),
    BullModule.registerQueue({
      name: 'geoDetect',
  }),
  ],
  providers: [AuthService, GoogleProvider],
  controllers: [AuthController, AuthConfirmController],
  exports: [AuthService],
})
export class AuthModule {}