import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, EmailConfirmedGuard } from '../users/auth/auth.guard';
import { Response } from 'express';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UsersService } from '../users/users.service';

@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService,
                private usersService: UsersService){}

    // @Get('/')
    // async getAll(@Res() res: Response) {
    //     return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: await this.newsService.getAll() });
    // }

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Post('create')
    async getProfile(@Req() request, @Body() dto: CreateItemDto) {
        const user = await this.usersService.getById(request.user.id, ['id', 'name']);
        const newItem = await this.itemsService.create(dto, user);

        return newItem;
    }
}