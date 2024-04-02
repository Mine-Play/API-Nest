import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items.entity';
import { ShopItem } from './shop/shop.entity';
import { ItemPersonalizeModule } from './types/personalization/personalization.module';
import { ShopItemModule } from './shop/shop.module';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { SessionsService } from '../users/sessions/sessions.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [],
  imports: [
    TypeOrmModule.forFeature([ Item, ShopItem ]),
    ItemPersonalizeModule,
    ShopItemModule,
    UsersModule
  ],
})
export class ItemsModule {}