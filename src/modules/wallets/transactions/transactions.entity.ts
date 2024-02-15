import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { Wallet } from '../wallets.entity';


@Entity("wallets__transactions")
export class Transaction {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "varchar" })
    action: string;

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