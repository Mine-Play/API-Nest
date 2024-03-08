import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard, EmailConfirmedGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Get("/me")
    async me(@Req() request, @Res() res: Response) {
        const user = await this.userService.getMe(request.user.id);
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: user });
    }
}