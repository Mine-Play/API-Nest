import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { User } from '../users/users.entity';
import { Sellable } from './shop.types';

@Entity("shop")
export class Shop {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "string" })
    itemtype: Sellable;

    @Column({ type: "uuid" })
    itemId: string;

    @Column({ type: "integer" })
    money: number;

    @Column({ type: "integer", default: null })
    coins: number;

    @Column({ type: "integer", default: null })
    keys: number;

    @Column({ type: 'bigint', readonly: true, default: 0 })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.floor(Date.now() / 1000);
    }

    @Column({ type: 'bigint', default: 0 })
    updatedAt: number;

    @BeforeUpdate()
    updateDateUpdate() {
        this.updatedAt = Math.round(new Date().getTime() / 1000);
    }
}