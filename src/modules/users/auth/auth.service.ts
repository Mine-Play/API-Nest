import { BadRequestException } from '../../../exceptions/BadRequestException';
import { Injectable, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users.service';
import { SessionsService } from '../sessions/sessions.service';
import { NotRegisteredException, UnauthorizedException } from '../../../exceptions/UnauthorizedException';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as useragent from 'useragent';
import { VerifyService } from '../../verify/verify.service';
import { WalletsService } from '../../wallets/wallets.service';
import { User } from '../users.entity';
import { EmailHelper } from 'src/helpers/email.helper';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GoogleProvider } from 'src/services/authProviders/google.provider';
import { DiscordProvider } from 'src/services/authProviders/discord.provider';
import { AuthProvider } from './auth.provider.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from 'src/exceptions/NotFoundException';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthProvider) private authProviderRepository: Repository<AuthProvider>,
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService,
    private confirmationsService: VerifyService,
    private walletsService: WalletsService,
    private googleProvider: GoogleProvider,
    private discordProvider: DiscordProvider,
    @InjectQueue('geoDetect') private geoDetectQueue: Queue
  ) {}
  async login(login, password) {
    const user = await this.usersService.getByLogin(login, ['id', 'name', 'password', 'isEmailConfirmed', 'email']);
    if (!user || !(await argon2.verify(user?.password, password))) {
      throw new UnauthorizedException();
    }
    if(!user.isEmailConfirmed){
      this.confirmationsService.regenerate("email", user, true);
    } 
    return user;
  }

  async getRedirectURL(provider: string): Promise<string> {
    switch(provider) {
      case "google":
        return this.googleProvider.getRedirectURL();
      case "discord":
        return this.discordProvider.getRedirectURL();
      default:
        throw new NotFoundException();
    }
  }

  async callback(provider: string, request) {
    let callback;
    switch(provider) {
      case "google":
        callback = await this.googleProvider.callback(request);
        break;
      case "discord":
        callback = await this.discordProvider.callback(request);
        break;
      default:
        throw new NotFoundException();
    }

    const user = await this.usersService.getByEmail(callback.email);

	//Email not found
    if(!user) {
      throw new NotRegisteredException();
    }

	const providerInfo = this.authProviderRepository.findOne({ where: { providerId: callback.id, provider } });

	if(!providerInfo) {
		//Needs TOTP to continue(TODO)
		// throw new NeedsTwoFactorException();
	}

	return user;
  }

  /**
   * Register a user
   * @param name 
   * @param email 
   * @param password 
   * @returns User
   * 
   * Errors: 4101 - name or email already registered
   */
  async register(name, email, password, invitedBy) {

    /**
     * User's data unique validation
     * Create a 2 queries with multi-threading
     */
    const nameValidate = this.usersService.getByName(name);
    const emailValidate = this.usersService.getByEmail(email);
    const uniqueValidator = await Promise.all([ nameValidate, emailValidate ]);

    //Check unique after finish 2 queries
    if (uniqueValidator[0]) {
        throw new BadRequestException(4101, "Данный ник уже зарегистрирован!");
    }

    if (uniqueValidator[1]) {
      throw new BadRequestException(4102, "Данная почта уже зарегистрирована!");
    }
    const hash = await argon2.hash(password);
    const user = await this.usersService.create({
      name: name,
      email: email,
      password: hash
    }, invitedBy);
    this.confirmationsService.generate("email", user);
    this.walletsService.register(user);
    return user;
  }
  async logout(userId: string, sessionId: string): Promise<boolean> {
    const user = await this.usersService.getById(userId);
    if(!user) {
      return false;
    }
    const session = await this.sessionsService.getById(sessionId);
    this.sessionsService.destroy(session);
  }
  async respondWithToken(user: User, request){
    const agent = await useragent.parse(request.headers['user-agent']);
    let device;
    if (agent.device.family == 'Other') {
      device = `PC ${agent.os.toString()}`;
    } else {
      device = `${agent.device.toString()}, ${agent.os.toString()}`;
    }

    let ip;
    if(request.ip == "::1"){
      ip = "188.243.225.201";
    }else{
      ip = request.ip;
    }
    const activeSessions = await this.sessionsService.getByUser(user);
    let session;
    for(let i = 0; i < activeSessions.length; i++){
      if(activeSessions[i].ip == request.ip && activeSessions[i].device == device && activeSessions[i].browser == agent.family && activeSessions[i].place == "Site"){
          session = activeSessions[i];
          this.sessionsService.update(session);
          break;
      }
    }
    if(session === undefined){
      session = await this.sessionsService.create({
        ip: request.ip,
        device: device,
        browser: agent.family,
        place: 'Site',
        user: user,
        country: 0,
        city: 0,
      });
      this.geoDetectQueue.add("getLocation", { session, ip });
    }
    const payload = { id: user.id, session: session.id }; 

    if(user.isEmailConfirmed) {
      return {
        status: HttpStatus.OK,
        name: user.name,
        tokenType: 'Bearer',
        token: await this.jwtService.signAsync(payload),
        session: session.id,
        isEmailConfirmed: true
      };
    } else {
      return {
        status: HttpStatus.OK,
        name: user.name,
        tokenType: 'Bearer',
        token: await this.jwtService.signAsync(payload),
        session: session.id,
        isEmailConfirmed: false,
        obusficatedEmail: EmailHelper.obusficate(user.email)
      };
    }
  }
}
