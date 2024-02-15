import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ItemType } from './types/types.entity';

@Entity("items")
export class Item {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    slug: string;

    @Column({ type: "varchar" })
    name: string;

    @ManyToOne(() => ItemType, (itemType) => itemType.items)
    @JoinColumn()
    type: ItemType

}