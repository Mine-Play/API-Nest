import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemPersonalization } from './personalization.entity';
import { ItemPersonalizationRarity } from './rarity/personalization.rarity.entity';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [
    TypeOrmModule.forFeature([ ItemPersonalization, ItemPersonalizationRarity ], 'minigames')
  ],
})
export class ItemPersonalizeModule {}
