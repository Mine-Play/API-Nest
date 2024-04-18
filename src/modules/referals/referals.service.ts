import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referal } from './referals.entity';
import { User } from '../users/users.entity';
import { ReferalsLevelsService } from './levels/referals.levels.service';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { isUUID } from 'src/helpers/language.helper';


@Injectable()
export class ReferalsService {
    constructor(@InjectRepository(Referal) private referalsRepository: Repository<Referal>,
                private referalsLevelsService: ReferalsLevelsService) {}

    async register(user: User): Promise<Referal>{
        const referal = await this.referalsRepository.create({ user });
        return await this.referalsRepository.save(referal);
    }

    async getByUser(user: User): Promise<Referal> {
        const referal = await this.referalsRepository.findOne({ where: { user } });
        if(referal) {
            referal.level = await this.referalsLevelsService.getByReferal(referal);
            return referal;
        }
    }
    
    async getByName(name: string, select = null): Promise<Referal> {
        let referal;
        if(isUUID(name)) {
            referal = await this.referalsRepository.findOne({ where: { id: name }, select: select });
        } else {
            referal = await this.referalsRepository.findOne({ where: { vipName: name }, select: select });
        }
        if(!referal) {
            throw new BadRequestException(4101, "Referal not found");
        }

        return referal;
    }

    async addInvite(referal: Referal): Promise<Referal> {
        referal.used += 1;
        return await this.referalsRepository.save(referal);
    }
}