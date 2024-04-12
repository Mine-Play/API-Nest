import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Shop } from './shop.entity';

@Injectable()
export class ShopService {
    constructor(@InjectRepository(Shop) private shopRepository: Repository<Shop>) {}

}
