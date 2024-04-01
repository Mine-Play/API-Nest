import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItem } from './shop.entity';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [
    TypeOrmModule.forFeature([ ShopItem ], 'minigames')
  ],
})
export class ShopItemModule {}
