import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}
    async getDefault(): Promise<Role> {
        let role = await this.rolesRepository.findOne({ where: { id: Number(process.env.ROLE_DEFAULT_ID) } });
        if(!role){ // <----- If default role not found
            role = await this.create({
                name: 'Игрок',
                slug: 'player',
                hexColor: '#FFFFFF',
                permissions: "*"
            });
        }
        return role;
    }
    async findById(id: number): Promise<Role | undefined> {
        const role = await this.rolesRepository.findOne({ where: { id: id } });
        return role;
    }

    async create(dto: CreateRoleDto): Promise<Role> {
        const role = await this.rolesRepository.create(dto);
        return await this.rolesRepository.save(role);
    }
}
