import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './shop.entity';
@Module({
  providers: [],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ Shop ]),
  ],
  exports: [  ]
})
export class ShopModule {}
