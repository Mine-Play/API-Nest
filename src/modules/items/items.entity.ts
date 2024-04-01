import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ShopItem } from './shop/shop.entity';
import { ItemPersonalization } from './types/personalization/personalization.entity';


@Entity("Items")
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    type: "PERSONALIZE" | "SERVICE" | "STATUS" | "PERK" | "KIT";
}