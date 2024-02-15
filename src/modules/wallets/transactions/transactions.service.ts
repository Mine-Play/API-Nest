import { Injectable } from '@nestjs/common';
import { User } from '../../users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../wallets.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { Item } from 'src/modules/items/items.entity';

@Injectable()
export class WalletsService {
    constructor(@InjectRepository(Transaction) private transactionsRepository: Repository<Transaction>) {}

    async getHistory() {

    }

    async makeTransaction(item: Item, wallet: Wallet, amount: number = null) {
        
    }
}