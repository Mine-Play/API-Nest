import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items.entity';
import { ShopItem } from './shop/shop.entity';
import { ItemPersonalizeModule } from './types/personalization/personalization.module';
import { ShopItemModule } from './shop/shop.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [
    TypeOrmModule.forFeature([ Item, ShopItem ], 'minigames'),
    ItemPersonalizeModule,
    ShopItemModule
  ],
})
export class ItemsModule {}
