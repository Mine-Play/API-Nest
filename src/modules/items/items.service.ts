import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './items.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { User } from '../users/users.entity';

@Injectable()
export class ItemsService {
    constructor(@InjectRepository(Item) private itemsRepository: Repository<Item>) {}

    async create(dto: CreateItemDto, user: User): Promise<Item> {
        if(dto.type != "PERSONALIZE" && dto.type != "SERVICE" && dto.type != "STATUS" && dto.type != "PERK" && dto.type != "KIT"){
            throw new BadRequestException(4101, 'Item type is incorrect!');
        }

        const item = await this.itemsRepository.create({ ...dto, createdBy: user });
        return await this.itemsRepository.save(item);
    }

    async getById(id: number): Promise<Item> {
        return await this.itemsRepository.findOne({ where: { id: id } });
    }
}