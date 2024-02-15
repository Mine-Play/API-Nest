import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsCategory } from './news.categories.entity';

@Injectable()
export class NewsCategoriesService {
    constructor(@InjectRepository(NewsCategory) private newsCatRepository: Repository<NewsCategory>) {}

    async getById(id: string): Promise<NewsCategory> {
        return await this.newsCatRepository.findOne({ where: { id: id } });
    }
}
