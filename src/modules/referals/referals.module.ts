import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referal } from './referals.entity';
import { ReferalsService } from './referals.service';
import { ReferalsController } from './referals.controller';
import { UsersModule } from '../users/users.module';
import { Referal_level } from './levels/referals.levels.entity';
import { ReferalsLevelsService } from './levels/referals.levels.service';

@Module({
  controllers: [ReferalsController],
  providers: [ReferalsService, ReferalsLevelsService],
  exports: [ReferalsService],
  imports: [
    TypeOrmModule.forFeature([ Referal, Referal_level ]),
    UsersModule
  ]
})
export class ReferalsModule {}
