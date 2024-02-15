import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Transaction } from './transactions/transactions.entity';

@Entity("wallets")
export class Wallet {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "integer", default: 0 })
    money: number;

    @Column({ type: "integer", default: 0 })
    realcoins: number;

    @Column({ type: "integer", default: 0 })
    gamecoins: number;

    @Column({ type: "integer", default: 0 })
    keys: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @OneToMany(() => Transaction, (transaction) => transaction.wallet)
    transactions: Transaction[]
}