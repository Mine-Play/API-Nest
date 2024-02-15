import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemType } from './types.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ ItemType ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ItemTypesModule {}