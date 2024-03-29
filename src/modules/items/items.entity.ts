import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { ShopItem } from './shop/shop.entity';


@Entity("Items")
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    type: "PERSONALIZE" | "SERVICE" | "STATUS" | "PERK" | "KIT";

    @OneToOne(type => ShopItem, shopItem => shopItem.item)
    @JoinColumn({ name: "id" })
    shop: ShopItem;
}