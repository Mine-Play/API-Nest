import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateNewDto } from './dto/create-new.dto';
import { UsersService } from '../users/users.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService,
                private usersService: UsersService){}

    @Get('/')
    getAll() {
        return this.newsService.getAll();
    }

    @UseGuards(AuthGuard)
    @Post('create')
    async getProfile(@Req() request, @Body() dto: CreateNewDto) {
        const user = await this.usersService.getById(request.user.id);
        return await this.newsService.create(dto, user);
    }
}