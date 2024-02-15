import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items.entity';
import { ItemType } from './types/types.entity';
import { Personalization } from './personalization/personalization.entity';
import { PersonalizationRarity } from './personalization/rarity/personalization.rarity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Item, ItemType, Personalization, PersonalizationRarity ], 'minigames')
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ItemsModule {}