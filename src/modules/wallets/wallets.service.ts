import { TransactionsService } from './transactions/transactions.service';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { Repository } from 'typeorm';
import { Actions } from './transactions/transactions.types';
import { Bills, ExchangeBills } from './wallets.types';

@Injectable()
export class WalletsService {
    constructor(@InjectRepository(Wallet) private walletsRepository: Repository<Wallet>,
                private transactionsService: TransactionsService) {}

    set(wallet: Wallet, bill: Bills, value: number): Wallet {
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
        const balance = wallet[Bills.MONEY] += amount;
        this.set(wallet, Bills.MONEY, balance);
        this.walletsRepository.save(wallet);
        this.transactionsService.makeTransaction(wallet, Actions.REPLENISH, Bills.MONEY, amount);
        return wallet;
    }
    async exchange(user: User, bill: Bills, amount: number): Promise<Wallet | boolean>{
        const wallet = await this.walletsRepository.findOne({ where: { user: user } });
        if(wallet.money < amount) {
            return false;
        }
        wallet.money -= amount;
        let balance;
        switch(bill) {
            case Bills.COINS:
                balance = wallet.realcoins += (amount * Number(process.env.ECONOMY_COINS_COST));
                this.transactionsService.makeTransaction(wallet, Actions.EXCHANGE, Bills.MONEY, amount, ExchangeBills.COINS);
                break;
            case Bills.KEYS:
                balance = wallet.keys += (amount * Number(process.env.ECONOMY_COINS_COST));
                this.transactionsService.makeTransaction(wallet, Actions.EXCHANGE, Bills.MONEY, amount, ExchangeBills.KEYS);
                break;
        }
        this.set(wallet, Bills.MONEY, wallet.money);
        this.set(wallet, Bills.REALCOINS, balance);
        this.walletsRepository.save(wallet);
        return wallet;
    }

    async spend(user: User, bill: Bills, amount: number): Promise<Wallet | boolean> {
        const wallet = await this.walletsRepository.findOne({ where: { user: user } });
        if(bill == Bills.COINS){
            if((wallet.realcoins + wallet.gamecoins)  < amount) {
                return false;
            }
            if(wallet.realcoins >= amount) {
                    this.set(wallet, bill, (wallet.realcoins - amount));
                    this.walletsRepository.save(wallet);
            }else{
                wallet.gamecoins = (amount - wallet.realcoins);
                wallet.realcoins = 0;
                this.set(wallet, Bills.REALCOINS, wallet.realcoins);
                this.set(wallet, Bills.GAMECOINS, wallet.gamecoins);
                this.walletsRepository.save(wallet);
            }
            this.transactionsService.makeTransaction(wallet, Actions.PURCHASE, Bills.COINS, amount);
        }else{
            const balance = wallet[bill] -= amount;
            this.set(wallet, bill, balance);
            this.transactionsService.makeTransaction(wallet, Actions.PURCHASE, Bills.MONEY, amount);
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