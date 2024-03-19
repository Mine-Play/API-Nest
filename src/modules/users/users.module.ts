import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { RolesModule } from '../roles/roles.module';
import { SessionsModule } from '../sessions/sessions.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TexturesService } from './textures/textures.service';
import { StorageService } from 'src/services/storage.service';
import { TexturesController } from './textures/textures.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UsersSecurityController } from './users.security.controller';
import { Textures } from './textures/textures.entity';

@Module({
  controllers: [UsersController, TexturesController, UsersSecurityController],
  providers: [UsersService, TexturesService, StorageService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([ User, Textures ]),
    RolesModule,
    SessionsModule,
    WalletsModule,
    NestjsFormDataModule
  ]
})
export class UsersModule {}
