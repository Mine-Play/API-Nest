import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard, EmailConfirmedGuard } from './auth/auth.guard';
import { dateInterval } from 'src/helpers/language.helper';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as argon2 from 'argon2';
import { TwoFactorInvalidException } from 'src/exceptions/UnauthorizedException';

@Controller('users/security')
export class UsersSecurityController {
    constructor(private userService: UsersService){}

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Get("/passwordLastChange")
    async getPasswordLastChange(@Req() request, @Res() res: Response) {
        const user = await this.userService.getMe(request.user.id, ['passwordReset_at']);
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: { unix: user.passwordReset_at, human: dateInterval(user.passwordReset_at) } });
    }

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Post("/changePassword")
    async changePassword(@Req() request, @Res() res: Response, @Body() dto: ChangePasswordDto) {
        const user = await this.userService.getMe(request.user.id, ['id', 'password', 'passwordReset_at']);
        if (!user || !(await argon2.verify(user?.password, dto.password))) {
            throw new TwoFactorInvalidException();
        }

        await this.userService.changePassword(user, dto.newPassword);
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
    }
}