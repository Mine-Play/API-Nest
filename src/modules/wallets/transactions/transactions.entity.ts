import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { Wallet } from '../wallets.entity';
import { Bills, ExchangeBills } from '../wallets.types';
import { Actions } from './transactions.types';


@Entity("wallets__transactions")
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    action: Actions;

    @Column({ type: "varchar", default: null })
    exchangeTo: ExchangeBills;

    @Column({ type: "varchar" })
    bill: Bills;

    @Column({ type: "integer" })
    amount: number;

    @Column({ type: 'bigint', readonly: true, default: 0 })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.round(new Date().getTime() / 1000);
    }
    

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    @JoinColumn()
    wallet: Wallet
}