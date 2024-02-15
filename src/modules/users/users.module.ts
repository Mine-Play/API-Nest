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

@Module({
  controllers: [UsersController],
  providers: [UsersService, TexturesService, StorageService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([ User ]),
    RolesModule,
    SessionsModule,
    WalletsModule
  ]
})
export class UsersModule {}
