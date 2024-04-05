import { Entity, Column, JoinColumn, PrimaryColumn, OneToOne } from 'typeorm';
import { Item } from '../items.entity';

@Entity("Items_shop")
export class ShopItem {
    @PrimaryColumn()
    id: number;

    @Column({ type: "boolean", default: false })
    isFree: boolean;

    @Column({ type: "integer", default: null })
    money: number;

    @Column({ type: "integer", default: null })
    moneySale: number;

    @Column({ type: "integer", default: null })
    coins: number;

    @Column({ type: "integer", default: null })
    coinsSale: number;

    @Column({ type: "integer", default: null })
    keys: number;

    @Column({ type: "integer", default: null })
    keysSale: number;

    @Column({ type: "integer", default: null })
    limit: number;

    item: Item;
}