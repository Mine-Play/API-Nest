import { Entity, Column, JoinColumn, PrimaryColumn, OneToOne } from 'typeorm';
import { Item } from '../../items.entity';



@Entity("Items_personalization")
export class ShopItem {
    @Column({ type: "uuid" })
    @PrimaryColumn()
    id: string;

    @OneToOne(type => Item)
    @JoinColumn({ name: "id" })
    item: Item;
}