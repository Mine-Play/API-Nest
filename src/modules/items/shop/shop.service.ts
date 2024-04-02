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

    async addItemToShop(dto: AddItemToShopDto, item: Item): Promise<ShopItem> {
        delete dto.id;
        const shopItem = this.shopRepository.create({
            ...dto,
            id: item.id
        });

        return await this.shopRepository.save(shopItem);
    }

    async getItemInfo(item: Item): Promise<ShopItem>{
        return await this.shopRepository.findOne({ where: { id: item.id } });
    }
}