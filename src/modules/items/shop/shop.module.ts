import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItem } from './shop.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { UsersModule } from 'src/modules/users/users.module';
import { ItemsModule } from '../items.module';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  exports: [],
  imports: [
    TypeOrmModule.forFeature([ ShopItem ]),
    UsersModule,
    ItemsModule
  ],
})
export class ShopItemModule {}
