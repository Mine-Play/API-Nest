import { Injectable } from '@nestjs/common';
import { Session } from './sessions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class SessionsService {
    constructor(@InjectRepository(Session) private sessionRepository: Repository<Session>) {}

    async create(dto: Record<string, any>): Promise<Session> {
        const session = await this.sessionRepository.create(dto);
        return await this.sessionRepository.save(session);
    }

    async setGeo(session: Session, country: string, city: string): Promise<Session> {
        session.country = country;
        session.city = city;
        return await this.sessionRepository.save(session);
    }

    async getByUser(user: User): Promise<Session[]> {
        return await this.sessionRepository.find({ where: { user: user } });
    }

    async getCurrent(sessionId: string): Promise<Session[]> {
        return await this.sessionRepository.find({ where: { id: sessionId } });
    }

    async getById(id: string) {
        return await this.sessionRepository.findOne({ where: { id: id } });
    }
    async update(session: Session): Promise<Session> {
        session.updatedAt = Math.round(new Date().getTime() / 1000);
        this.sessionRepository.save(session);
        return session;
    }

    async destroy(session) {
        return await this.sessionRepository.remove(session);
    }

    async destroyAll(user: User) {
        
    }
    
    private hash(): string{
        let result;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const alphabetLength = alphabet.length;
        let counter = 0;
        while (counter < Number(process.env.SESSION_HASH_LENGTH)) {
          result += alphabet.charAt(Math.floor(Math.random() * alphabetLength));
          counter += 1;
        }
        return result;
    }
}
