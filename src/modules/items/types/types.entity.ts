import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany, JoinColumn } from 'typeorm';
import { Item } from '../items.entity';

@Entity("items_types")
export class ItemType {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    name: string;

    @OneToMany(type => Item, item => item.type)
    items: Item[];
}