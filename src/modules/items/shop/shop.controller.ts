import { ShopService } from './shop.service';
import { Body, Controller, Delete, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard, EmailConfirmedGuard } from 'src/modules/users/auth/auth.guard';
import { AddItemToShopDto } from './dto/add-item-to-shop.dto';
import { ItemsService } from '../items.service';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { RemoveFromShopDto } from './dto/remove-from-shop.dto';

@Controller('items/shop')
export class ShopController {
    constructor(private itemsService: ItemsService,
                private shopService: ShopService){}


    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Post('register')
    async addItemToShop(@Res() res: Response, @Body() dto: AddItemToShopDto) {
        const item = await this.itemsService.getById(dto.id);
        if(!item) {
            throw new BadRequestException(4101, "Предмет с данным артикулом не найден!");
        }
        const shopItem = await this.shopService.getItemInfo(item);
        if (shopItem) {
            throw new BadRequestException(4102, "Предмет уже добавлен в магазин!");
        }
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: await this.shopService.addToShop(dto, item) });
    }

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Delete('remove')
    async remove(@Body() dto: RemoveFromShopDto, @Res() res: Response) {
        const item = await this.itemsService.getById(dto.id);
        if(!item) {
            throw new BadRequestException(4101, "Предмет с данным артикулом не найден!");
        }

        const shopItem = await this.shopService.getItemInfo(item);
        if (!shopItem) {
            throw new BadRequestException(4102, "Данный предмет не числится в магазине!");
        }


        this.shopService.removeFromShop(item)
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
    }
}