import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items.entity';
import { ShopItem } from './shop/shop.entity';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [
    TypeOrmModule.forFeature([ Item, ShopItem ]),
  ],
})
export class ItemsModule {}
