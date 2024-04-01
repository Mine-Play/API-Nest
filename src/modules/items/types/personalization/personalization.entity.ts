import { Entity, Column, JoinColumn, PrimaryColumn, OneToOne, ManyToOne } from 'typeorm';
import { Item } from '../../items.entity';
import { ItemPersonalizationRarity } from './rarity/personalization.rarity.entity';


@Entity("Items_personalization")
export class ItemPersonalization {
    @PrimaryColumn()
    id: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "varchar" })
    placement: "HEAD" | "MASK" | "PET" | "BODY" | "DANCE" | "GRAPHITY" | "EMOTE";

    @ManyToOne(type => ItemPersonalizationRarity, rarity => rarity.items)
    @JoinColumn()
    rarity: ItemPersonalizationRarity
}