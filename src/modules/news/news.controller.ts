import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from '../users/auth/auth.guard';
import { CreateNewDto } from './dto/create-new.dto';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService,
                private usersService: UsersService){}

    @Get('/')
    async getAll(@Res() res: Response) {
        return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: await this.newsService.getPage(1) });
    }

    @UseGuards(AuthGuard)
    @FormDataRequest()
    @Post('create')
    async getProfile(@Req() request, @Body() dto: CreateNewDto) {
        const user = await this.usersService.getById(request.user.id);
        const newItem = await this.newsService.create(dto, user);

        return newItem;
    }
}