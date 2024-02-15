import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StorageService } from 'src/services/storage.service'
import { Item } from './items.entity';

@Injectable()
export class ItemsService {
    constructor(@InjectRepository(Item) private itemsRepository: Repository<Item>,
                                            private storageService: StorageService) {}

    // async getByName(name: string): Promise<Item> {
    //     let item = await this.itemsRepository.findOne({ where: { name: name } });
    // }

    getBySlug(slug: string): Promise<Item> {
        return this.itemsRepository.findOne({ where: { slug: slug } });
    }
}