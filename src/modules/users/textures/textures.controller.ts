import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { TexturesService } from './textures.service';
import { AuthGuard, EmailConfirmedGuard } from '../../auth/auth.guard';
import { UsersService } from '../users.service';
import { UploadSkinDto } from './dto/upload-skin.dto';

@Controller('users/textures')
export class UsersController {
    constructor(private texturesService: TexturesService,
                private usersService: UsersService){}

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Post("/skin")
    async me(@Req() request, @Res() res: Response, @Body() dto: UploadSkinDto){
        const user = await this.usersService.getById(request.user.id);
        const skinUpload = await this.texturesService.uploadSkin(user, dto);
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: skinUpload });
    }
}