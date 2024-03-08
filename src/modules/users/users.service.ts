import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RolesService } from '../roles/roles.service';
import { WalletsService } from '../wallets/wallets.service';
import { TexturesService } from './textures/textures.service';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                                         private rolesService: RolesService,
                                         private walletService: WalletsService,
                                         private texturesService: TexturesService) {}

    async create(dto: RegisterUserDto, roleId: number = null): Promise<User> {
        const role = await this.rolesService.getDefault();
        console.log(role)
        const user = await this.userRepository.create({
            ...dto,
            role: role
        });
        console.log(user)
        return await this.userRepository.save(user);
    }
    async emailConfirm(user: User){
        user.isEmailConfirmed = true;
        this.userRepository.save(user);
        return user;
    }
    async getByName(name: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { name: name } });
        return user;
    }

    async getByEmail(email: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { email: email } });
        return user;
    }

    async getByLogin(login: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: [ { name: login }, { email: login }] });
        return user;
    }
    async getById(id: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { id: id } });
        return user;
    }

    async getMe(id: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { id: id }, select: ['id', 'name', 'level', 'exp', 'avatar', 'skin', 'cloak', 'lastLogin', 'createdAt', 'role', 'banner', 'avatar', 'params'] });
        const avatar = await this.texturesService.getAvatar(user);
        const userSpecial = await Promise.all([this.walletService.getByUser(user, true), this.texturesService.getSkin(user), this.texturesService.getCloak(user), this.texturesService.getBanner(user), await this.rolesService.findByUser(user)]);
        user.avatar = avatar;
        user.wallet = userSpecial[0];
        user.skin = userSpecial[1];
        user.cloak = userSpecial[2];
        user.banner = userSpecial[3];
        user.role = userSpecial[4];
        delete user.params;
        return user;
    }
}