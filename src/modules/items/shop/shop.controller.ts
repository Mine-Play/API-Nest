import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard, EmailConfirmedGuard } from 'src/modules/users/auth/auth.guard';
import { AddItemToShopDto } from './dto/add-item-to-shop.dto';

@Controller('items/shop')
export class ItemsController {
    constructor(private itemsService: ItemsService,
                private usersService: UsersService){}

    // @Get('/')
    // async getAll(@Res() res: Response) {
    //     return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: await this.newsService.getAll() });
    // }

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Post('create')
    async getProfile(@Req() request, @Body() dto: AddItemToShopDto) {
        const user = await this.usersService.getById(request.user.id, ['id', 'name']);
        const newItem = await this.itemsService.create(dto, user);

        return newItem;
    }
}