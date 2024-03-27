import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { RolesModule } from '../roles/roles.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TexturesService } from './textures/textures.service';
import { StorageService } from 'src/services/storage.service';
import { TexturesController } from './textures/textures.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UsersSecurityController } from './users.security.controller';
import { Textures } from './textures/textures.entity';
import { SessionsController } from './sessions/sessions.controller';
import { SessionsService } from './sessions/sessions.service';
import { Session } from './sessions/sessions.entity';

@Module({
  controllers: [UsersController, TexturesController, SessionsController, UsersSecurityController],
  providers: [UsersService, TexturesService, StorageService, SessionsService],
  exports: [UsersService, SessionsService],
  imports: [
    TypeOrmModule.forFeature([ User, Textures, Session ]),
    RolesModule,
    WalletsModule,
    NestjsFormDataModule
  ]
})
export class UsersModule {}
