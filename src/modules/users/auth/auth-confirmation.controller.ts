import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { VerifyService } from '../../verify/verify.service';
import { UsersService } from '../users.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth/confirm')
export class AuthConfirmController {
    constructor(private verifyService: VerifyService,
                private usersService: UsersService) {}

    @Throttle({ default: { limit: 1, ttl: 60000 } })
    @UseGuards(AuthGuard)
    @Post('resend')
    async emailResend(@Req() request, @Body() body) {
        const user = await this.usersService.getById(request.user.id);
        return this.verifyService.regenerate("email", user, body);
    }

    @Throttle({ default: { limit: 3, ttl: 30000 } })
    @UseGuards(AuthGuard)
    @Post('pin')
    async emailVerify(@Req() request, @Body() body) {
        const user = await this.usersService.getById(request.user.id);
        const verify = await this.verifyService.verify("email", user, body);
        if(verify){
            this.usersService.emailConfirm(user);
            return {
                "status": HttpStatus.OK
            }
        }
    }
}