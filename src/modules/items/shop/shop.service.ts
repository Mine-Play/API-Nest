import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { ShopItem } from './shop.entity';
import { AddItemToShopDto } from './dto/add-item-to-shop.dto';
import { Item } from '../items.entity';

@Injectable()
export class ShopService {
    constructor(@InjectRepository(ShopItem) private shopRepository: Repository<ShopItem>) {}

    async addToShop(dto: AddItemToShopDto, item: Item): Promise<ShopItem> {
        delete dto.id;
        let isFree = false;
        if(dto.money == undefined && dto.coins == undefined && dto.keys == undefined) {
            isFree = true;
        }
        const shopItem = this.shopRepository.create({
            ...dto,
            id: item.id,
            isFree
        });

        return await this.shopRepository.save(shopItem);
    }

    async removeFromShop(item: Item) {
        return await this.shopRepository.delete({ id: item.id });
    }

    async getItemInfo(item: Item): Promise<ShopItem>{
        return await this.shopRepository.findOne({ where: { id: item.id } });
    }
}