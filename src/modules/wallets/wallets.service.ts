import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletsService {
    constructor(@InjectRepository(Wallet) private walletsRepository: Repository<Wallet>) {}
    set(wallet: Wallet, bill: string, value: number): Wallet {
        wallet[bill] = value;
        this.walletsRepository.save(wallet);
        return wallet;
    }

    async register(user: User){
        const wallet = await this.walletsRepository.create({ user: user });
        return await this.walletsRepository.save(wallet);
    }

    async replenish(user: User, amount: number): Promise<Wallet>{
        const wallet = await this.walletsRepository.findOne({ where: { user: user } });
        const balance = wallet["money"] += amount;
        this.set(wallet, "money", balance);
        this.walletsRepository.save(wallet);

        return wallet;
    }
    async exchange(user: User, bill: string, amount: number): Promise<Wallet | boolean>{
        const wallet = await this.walletsRepository.findOne({ where: { user: user } });
        if(wallet.money < amount) {
            return false;
        }
        wallet.money -= amount;
        let balance;
        switch(bill) {
            case "coins":
                balance = wallet.realcoins += (amount * Number(process.env.ECONOMY_COINS_COST));
                break;
            case "keys":
                balance = wallet.keys += (amount * Number(process.env.ECONOMY_COINS_COST));
                break;
        }
        this.set(wallet, "money", wallet.money);
        this.set(wallet, "realcoins", balance);
        this.walletsRepository.save(wallet);

        return wallet;
    }

    async spend(user: User, bill: string, amount: number): Promise<Wallet | boolean> {
        const wallet = await this.walletsRepository.findOne({ where: { user: user } });
        if(bill == "coins"){
            if((wallet.realcoins + wallet.gamecoins)  < amount) {
                return false;
            }
            if(wallet.realcoins >= amount) {
                    this.set(wallet, bill, (wallet.realcoins - amount));
                    this.walletsRepository.save(wallet);
            }else{
                wallet.gamecoins = (amount - wallet.realcoins);
                wallet.realcoins = 0;
                this.set(wallet, "realcoins", wallet.realcoins);
                this.set(wallet, "gamecoins", wallet.gamecoins);
                this.walletsRepository.save(wallet);
            }
        }else{
            const balance = wallet[bill] -= amount;
            this.set(wallet, bill, balance);
            this.walletsRepository.save(wallet);
        }

        return wallet;
    }

    async getByUser(user: User, unionCoins = false): Promise<Wallet | undefined> {
        let wallet = await this.walletsRepository.findOne({ where: { user: user } });

        if(unionCoins){
            wallet = this.unionCoins(wallet);
        }

        return wallet;
    }

    unionCoins(wallet: Wallet): Wallet {
        wallet.coins = wallet.realcoins + wallet.gamecoins;
        delete wallet.gamecoins;
        delete wallet.realcoins;

        return wallet;
    }
}