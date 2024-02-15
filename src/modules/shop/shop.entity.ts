import { Entity, Column, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Item } from '../items/items.entity';

@Entity("shop")
export class Shop {
    @Column({ type: "uuid" })
    @PrimaryColumn()
    id: string;

    @Column({ type: "varchar" })
    bill: string;

    @Column({ type: "integer" })
    cost: number;

    @Column({ type: "integer", default: null })
    sale: number;

    @OneToOne(type => Item)
    @JoinColumn({ name: "id" })
    item: Item;
}