import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RolesService } from '../roles/roles.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                                         private rolesService: RolesService) {}

    async create(dto: RegisterUserDto, roleId: number = null): Promise<User> {
        const role = await this.rolesService.getDefault();
        const user = await this.userRepository.create({
            ...dto,
            role: role
        });
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

    /**
     * 
     * @param id user id
     * @returns Authorized user object
     */
    async getMe(id: string, select = null): Promise<User | undefined> {
        if(select){
            return await this.userRepository.findOne({ where: { id: id }, select: select });
        }
        return await this.userRepository.findOne({ where: { id: id } });
    }

    async setSkin(user: User, skinType: number, skinID: string = null): Promise<User> {
        user.skin = skinType;

        if(skinType === 3) {
            user.params.skin = skinID;
        }
        return await this.userRepository.save(user);
    }
    
    async changePassword(user: User, password: string): Promise<boolean> {
        const hash = await argon2.hash(password);
        user.password = hash;
        user.passwordReset_at = Math.floor(Date.now() / 1000);
        await this.userRepository.save(user);

        return true;
    }
}