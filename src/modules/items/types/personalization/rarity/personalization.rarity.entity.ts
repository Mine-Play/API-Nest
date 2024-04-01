import { Entity, Column, JoinColumn, PrimaryColumn, OneToOne, OneToMany } from 'typeorm';
import { ItemPersonalization } from '../personalization.entity';



@Entity("Items_personalization_rarity")
export class ItemPersonalizationRarity {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "varchar" })
    brandName: string;

    @Column({ type: "varchar" })
    backgroundColor: string;

    @Column({ type: "varchar" })
    textColor: string;

    @OneToMany(() => ItemPersonalization, (item) => item.rarity)
    items: ItemPersonalization[];
}