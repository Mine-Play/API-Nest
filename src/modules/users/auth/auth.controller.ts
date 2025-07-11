import { Body, Controller, Post, HttpStatus, UseGuards, Get, Req, Res, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { ReferalsService } from 'src/modules/referals/referals.service';
import { BadRequestException } from 'src/exceptions/BadRequestException';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private referalsService: ReferalsService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Req() request, @Body() dto: LoginUserDto) {
    const user = await this.authService.login(dto.login, dto.password);
    return this.authService.respondWithToken(user, request);
  }

  @Get('login/:provider')
  async getOauthURL(@Res() res: Response, @Param('provider') provider) {
    const redirectUrl = await this.authService.getRedirectURL(provider);
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: { redirectUrl } });
  }

  @Get('login/:provider/callback')
  async getOauthCallback(@Query() query, @Param('provider') provider, @Req() request) {
    const callback = await this.authService.callback(provider, query);
    return this.authService.respondWithToken(callback, request);
  }
  
  @Throttle({ default: { limit: 3, ttl: 15000 } })
  @Post('register')
  async register(@Req() request, @Body() dto: RegisterUserDto) {
    let referal = null;
    if(dto.invitedBy != null) {
      referal = await this.referalsService.getByName(dto.invitedBy);
      if(!referal) {
          throw new BadRequestException(4103, "Referal not found");
      }
    } 
    const user = await this.authService.register(dto.name, dto.email, dto.password, referal);
    return this.authService.respondWithToken(user, request);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() request, @Res() res: Response) {
    this.authService.logout(request.user.id, request.user.session);

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}