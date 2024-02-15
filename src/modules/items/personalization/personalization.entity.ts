import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Item } from '../items.entity';
import { PersonalizationRarity } from './rarity/personalization.rarity.entity';

@Entity("personalization")
export class Personalization {
    @Column({ type: "uuid" })
    @PrimaryColumn()
    id: string;

    @OneToOne(type => Item)
    @JoinColumn({ name: "id" })
    item: Item;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "varchar" })
    placement: string;

    @OneToOne(type => PersonalizationRarity)
    @JoinColumn()
    rarity: PersonalizationRarity;
}