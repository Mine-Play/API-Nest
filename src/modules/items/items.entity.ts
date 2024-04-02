import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
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

    @ManyToOne(() => User, (user) => user.items)
    @JoinColumn({ name: 'createdBy' })
    createdBy: User

    shop: ShopItem;

    info: ItemPersonalization;
}