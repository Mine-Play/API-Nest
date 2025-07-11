import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './otp.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([ OTP ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class OTPModule {}