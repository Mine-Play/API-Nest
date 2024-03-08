import { Injectable } from '@nestjs/common';
import { User } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from 'src/services/storage.service';

import { Texture } from './textures.types';

import { Avatar } from 'src/helpers/avatar.helper';
import { UploadSkinDto } from './dto/upload-skin.dto';
import { BadRequestException } from 'src/exceptions/BadRequestException';
@Injectable()
export class TexturesService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                                        private storageService: StorageService) {}

    getSkin(user: User): Texture {
        let url, type, assetType;
        switch(user.skin){
            case 0:
                assetType = 0;
                url = this.storageService.get(process.env.SKIN_DEFAULT_URI);
                type = process.env.SKIN_DEFAULT_TYPE;
                break;
            case 1:
                assetType = 1;
                url = this.storageService.get(`/users/${user.id}/skins/skin.png`);
                type = "default";
                break;
            case 2:
                assetType = 2;
                url = this.storageService.get(`/users/${user.id}/skins/skin.png`);
                type = "default";
                break;
            case 3:
                assetType = 3;
                url = this.storageService.get(`/users/library/skins/skin.png`);
                type = "default";
                break;
        }
        return { url, type, assetType }
    }

    async getCloak(user: User): Promise<Texture | boolean> {
        let url, assetType;
        switch(user.cloak){
            case 0:
                assetType = 0;
                return false;
            case 1:
                assetType = 1;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 2:
                assetType = 2;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 3:
                assetType = 3;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
        }
        return { url, assetType }
    }

    async getAvatar(user: User): Promise<Texture> {
        let url, assetType, image;
        switch(user.avatar){
            case 0:
                assetType = 0;
                image = await Avatar.classic(this.getSkin(user).url);
                return { assetType: assetType, image: image };
            case 1:
                assetType = 1;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 2:
                assetType = 2;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 3:
                assetType = 3;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
        }
        return { url, assetType }
    }

    async getBanner(user: User): Promise<Texture | boolean | string> {
        let url, assetType;
        switch(user.banner){
            case 0:
                return { assetType: 0, color: user.params.banner };
            case 1:
                assetType = 1;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 2:
                assetType = 2;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 3:
                assetType = 3;
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
        }
        return { url, assetType }
    }

    async uploadSkin(user: User, dto: UploadSkinDto): Promise<Texture> {
        const url: string | boolean = await this.storageService.upload(dto.skin, `/users/${user.id}/skins`, 'skin.png');
        if(dto.type != 'slim' && dto.type != 'default') {
            throw new BadRequestException(4101, 'Invalid skin type.');
        }
        return { assetType: 1, url, type: dto.type }
    }
}