import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Shop ], 'minigames')
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ShopModule {}