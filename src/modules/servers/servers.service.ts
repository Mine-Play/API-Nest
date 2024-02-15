import { Inject, Injectable } from '@nestjs/common';
import { status } from 'minecraft-server-util';
import { Repository } from 'typeorm';
import { Server } from './servers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ServersService {
    constructor(@InjectRepository(Server) private serversRepository: Repository<Server>,
                @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async getIndex(): Promise<Server[] | boolean> {
        const servers = await this.serversRepository.find({ where: { isIndex: true } });
        if(servers){
            let serverPingArray = [];
            for(let i = 0; i < servers.length; i++){
                    let address = servers[i].address.split(":");
                    if(address[1] === undefined || address[1] === null){
                        address[1] = "25565";
                    }
                    serverPingArray[i] = status(address[0], Number(address[1])); 
            }
            let serverPing = await Promise.all(serverPingArray);
            
            for(let i = 0; i < servers.length; i++){
                let online = this.cacheManager.get(`${servers[i].slug}_online`);
                let max = this.cacheManager.get(`${servers[i].slug}_max`);
                let serverInfo = await Promise.all([online, max]);
                if(serverInfo[0] === null){
                    this.cacheManager.set(`${servers[i].slug}_online`, serverPing[i].players.online, 5000);
                }
                if(serverInfo[1] === null){
                    this.cacheManager.set(`${servers[i].slug}_max`, serverPing[i].players.max, 600000);
                }
                servers[i].status = {
                    online: serverPing[i].players.online,
                    max: serverPing[i].players.max
                }
            }
            return servers;
        }
        return false;
    }
}   