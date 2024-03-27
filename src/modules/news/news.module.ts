import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news.entity';
import { NewsCategory } from './categories/news.categories.entity';
import { NewsComment } from './comments/news.comments.entity';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { UsersModule } from '../users/users.module';
import { NewsCategoriesService } from './categories/news.categories.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ News, NewsCategory, NewsComment ]),
    UsersModule
  ],
  providers: [NewsService, NewsCategoriesService],
  controllers: [NewsController],
  exports: [],
})
export class NewsModule {}