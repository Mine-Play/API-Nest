import { Injectable } from '@nestjs/common';
import { User } from '../../users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../wallets.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { Bills, ExchangeBills } from '../wallets.types';
import { Actions } from './transactions.types';

@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transaction) private transactionsRepository: Repository<Transaction>) {}

    async getHistory(wallet: Wallet): Promise<Transaction[]> {
        const transactions = await this.transactionsRepository.find({ where: { wallet: wallet } });
        return transactions;
    }

    async makeTransaction(wallet: Wallet, action: Actions, bill: Bills, amount: number, exchangeTo: ExchangeBills = null) {
        const transaction = await this.transactionsRepository.create({ action, bill, amount, wallet, exchangeTo });
        return await this.transactionsRepository.save(transaction);
    }
}