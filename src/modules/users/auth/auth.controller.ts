import { Body, Controller, Post, HttpStatus, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Req() request, @Body() dto: LoginUserDto) {
    const user = await this.authService.login(dto.login, dto.password);
    return this.authService.respondWithToken(user, request);
  }

  @Get('login/google')
  async getGoogleURL() {
    return this.authService.getRedirectURL("google");
  }

  // @Get('login/google/callback')
  // async googleCallback(@Req() request: Request) {
  //   return this.authService.callback("google", request);
  // }
  
  @Throttle({ default: { limit: 3, ttl: 15000 } })
  @Post('register')
  async register(@Req() request, @Body() dto: RegisterUserDto) {
    const user = await this.authService.register(dto.name, dto.email, dto.password);
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