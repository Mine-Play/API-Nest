import { Entity, Column, JoinColumn, PrimaryColumn, OneToOne } from 'typeorm';
import { Item } from '../items.entity';

@Entity("Items_shop")
export class ShopItem {
    @PrimaryColumn()
    id: string;

    @Column({ type: "integer", default: 0 })
    money: number;

    @Column({ type: "integer", default: 0 })
    moneySale: number;

    @Column({ type: "integer", default: 0 })
    coins: number;

    @Column({ type: "integer", default: 0 })
    coinsSale: number;

    @Column({ type: "integer", default: 0 })
    keys: number;

    @Column({ type: "integer", default: 0 })
    keysSale: number;
}