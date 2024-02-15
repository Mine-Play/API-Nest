import { Injectable } from '@nestjs/common';
import { User } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from 'src/services/storage.service';

import { Texture } from './textures.types';

@Injectable()
export class TexturesService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                                        private storageService: StorageService) {}

    async getSkin(user: User): Promise<Texture> {
        let url;
        let type;
        switch(user.skin){
            case 0:
                url = this.storageService.get(process.env.SKIN_DEFAULT_URI);
                type = process.env.SKIN_DEFAULT_TYPE;
                break;
            case 1:
                url = this.storageService.get(`/users/${user.id}/skins/skin.png`);
                type = "default";
                break;
            case 2:
                url = this.storageService.get(`/users/${user.id}/skins/skin.png`);
                type = "default";
                break;
            case 3:
                url = this.storageService.get(`/users/library/skins/skin.png`);
                type = "default";
                break;
        }
        return { url, type }
    }

    async getCloak(user: User): Promise<Texture | boolean> {
        let url;
        switch(user.cloak){
            case 0:
                return false;
            case 1:
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 2:
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 3:
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
        }
        return { url }
    }

    async getAvatar(user: User): Promise<Texture | boolean> {
        let url;
        switch(user.avatar){
            case 0:
                return false;
            case 1:
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 2:
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
            case 3:
                url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
                break;
        }
        return { url }
    }

    async uploadSkin(user: User, skin): Promise<Texture | boolean> {
        let url: string | boolean = await this.storageService.upload(skin, `/users/${user.id}/skins`, 'skin.png');
        let type: string | boolean = false;

        if(url){
            
        }
        return { url, type }
    }
}