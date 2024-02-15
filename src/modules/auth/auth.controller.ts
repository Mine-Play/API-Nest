import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Req, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Req() request, @Body() dto: LoginUserDto) {
    const user = await this.authService.login(dto.login, dto.password);
    return this.authService.respondWithToken(user, request);
  }
  
  @Throttle({ default: { limit: 1, ttl: 15000 } })
  @Post('register')
  async register(@Req() request, @Body() dto: RegisterUserDto) {
    const user = await this.authService.register(dto.name, dto.email, dto.password);
    return this.authService.respondWithToken(user, request);
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}