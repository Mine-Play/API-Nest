import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { News } from './news.entity';
import { CreateNewDto } from './dto/create-new.dto';
import { textToSlug } from 'src/helpers/language.helper';
import { NewsCategoriesService } from './categories/news.categories.service';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { StorageService } from 'src/services/storage.service';

@Injectable()
export class NewsService {
    constructor(@InjectRepository(News) private newsRepository: Repository<News>,
                                        private newsCatService: NewsCategoriesService,
                                        private storageService: StorageService) {}
    PAGELIMIT = 7;

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
            time: Number(dto.time),
            author: user,
            slug: textToSlug(dto.name),
            category: validator[1],
        });
        const newSave = await this.newsRepository.save(news);
        const previewPath = await this.storageService.upload(dto.preview, '/news/', `${news.id}.png`);
        newSave.preview = previewPath;
        return await this.newsRepository.save(newSave);
    }

    async getLimit(limit: number = null, select = null): Promise<News[]> {
        if(select === null) select = ['id', 'uuid', 'slug', 'name', 'shortStory', 'views', 'likes', 'time', 'createdAt', 'updatedAt'];

        return await this.newsRepository.find({ 
            select: select,
            order: { 
                createdAt: "DESC"
            },
            take: limit
        });
    }

    async getPage(page: number, select = null): Promise<News[]> {
        if(select === null) select = ['id', 'uuid', 'slug', 'name', 'shortStory', 'views', 'likes', 'time', 'createdAt', 'updatedAt'];

        return await this.newsRepository.find({ 
            select: select,
            order: { 
                createdAt: "DESC"
            },
            skip: (page * this.PAGELIMIT),
            take: this.PAGELIMIT
        });
    }

    getPreview(newItem: News) {
        return this.storageService.get(`/news/${newItem.id}.png`);
    }
}
