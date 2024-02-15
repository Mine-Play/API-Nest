import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { News } from './news.entity';
import { CreateNewDto } from './dto/create-new.dto';
import { textToSlug } from 'src/helpers/language.helper';
import { NewsCategoriesService } from './categories/news.categories.service';
import { BadRequestException } from 'src/exceptions/BadRequestException';

@Injectable()
export class NewsService {
    constructor(@InjectRepository(News) private newsRepository: Repository<News>,
                                        private newsCatService: NewsCategoriesService) {}

    async create(dto: CreateNewDto, user: User): Promise<News> {
        const nameUnique = this.newsRepository.findOne({ where: { name: dto.name } });
        const category = this.newsCatService.getById(dto.category);
        const validator = await Promise.all([ nameUnique, category ]);

        if(validator[0]) {
            throw new BadRequestException(4101, "Current name already exists");
        }
        if(!validator[1]) {
            throw new BadRequestException(4102, "Category doesn't exist");
        }
        
        const news = await this.newsRepository.create({
            name: dto.name,
            shortStory: dto.shortStory,
            fullStory: dto.fullStory,
            author: user,
            slug: textToSlug(dto.name),
            category: validator[1],
        });

        return await this.newsRepository.save(news);
    }

    async getAll(): Promise<News[]> {
        return await this.newsRepository.find();
    }
}
