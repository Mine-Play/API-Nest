import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("personalization_rarity")
export class PersonalizationRarity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    slug: string;
    
    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    fill: string;
}