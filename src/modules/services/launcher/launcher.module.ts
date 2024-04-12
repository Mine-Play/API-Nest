import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsController } from './news/news.controller';
import { NewsModule } from 'src/modules/news/news.module';
import { UsersModule } from 'src/modules/users/users.module';
@Module({
  providers: [],
  controllers: [NewsController],
  imports: [UsersModule, NewsModule],
  exports: []
})
export class LauncherModule {}
