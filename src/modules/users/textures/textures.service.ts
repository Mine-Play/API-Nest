import { UsersService } from './../users.service';
import { Injectable } from '@nestjs/common';
import { User } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from 'src/services/storage.service';

import { Texture } from './textures.types';

import { Avatar } from 'src/helpers/avatar.helper';
import { UploadSkinDto } from './dto/upload-skin.dto';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { SetSkinDto } from './dto/set-skin.dto';
import { Textures } from './textures.entity';

@Injectable()
export class TexturesService {
    constructor(private storageService: StorageService,
                private usersService: UsersService,
                @InjectRepository(Textures) private texturesRepository: Repository<Textures>) {}

    async getUserSkin(user: User): Promise<Texture> {
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
                const skin = await this.texturesRepository.findOne({ where: { id: user.params.skin, textureType: 0 } });
                url = this.storageService.get(`${process.env.TEXTURES_LIBRARY_SKINS_PATH}/${skin.id}.png`);
                type = skin.params;
                break;
        }
        return { url, type, assetType }
    }

    async getUserCloak(user: User): Promise<Texture | boolean> {
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

    async getUserAvatar(user: User): Promise<Texture> {
        let url, assetType, image;
        switch(user.avatar){
            case 0:
                assetType = 0;
                const skin = await this.getUserSkin(user);
                image = await Avatar.classic(skin.url);
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

    async getUserBanner(user: User): Promise<Texture | boolean | string> {
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

    async uploadUserSkin(user: User, dto: UploadSkinDto): Promise<Texture> {
        const url: string | boolean = await this.storageService.upload(dto.file, `/users/${user.id}/skins`, 'skin.png');
        if(dto.type != 'slim' && dto.type != 'default') {
            throw new BadRequestException(4101, 'Invalid skin type.');
        }
        this.usersService.setSkin(user, 1);
        if(user.avatar == 0){
            const avatar = await this.getUserAvatar(user);
            return { assetType: 1, url, type: dto.type, etc: { avatar: avatar } }
        }
        return { assetType: 1, url, type: dto.type }
    }

    async setUserSkin(user: User, dto: SetSkinDto): Promise<Texture> {
        const skin = await this.texturesRepository.findOne({ where: { id: dto.skinId, textureType: 0 } });
        if(!skin) {
            throw new BadRequestException(4101, 'Texture with current ID is not found.');
        }
        this.usersService.setSkin(user, 3, dto.skinId);
        if(user.avatar == 0){
            const avatar = await this.getUserAvatar(user);
            return { assetType: 3, url: this.storageService.get(`${process.env.TEXTURES_LIBRARY_SKINS_PATH}/${dto.skinId}.png`), type: skin.params, etc: { avatar: avatar } }
        }
        
        return { assetType: 3, url: this.storageService.get(`${process.env.TEXTURES_LIBRARY_SKINS_PATH}/${dto.skinId}.png`), type: skin.params }
    }

    async getLibrarySkins(): Promise<Textures[]> {
        const skins = await this.texturesRepository.find({ where: { textureType: 0 }, select: ['id', 'params', 'name'] });
        for(let i = 0; i < skins.length; i++) {
            skins[i].texture = { assetType: 3, url: this.storageService.get(`${process.env.TEXTURES_LIBRARY_SKINS_PATH}/${skins[i].id}.png`), type: skins[i].params }
            delete skins[i].params;
        }

        return skins;
    }
}