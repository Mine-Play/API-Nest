import { Entity, Column, JoinColumn, PrimaryColumn, OneToOne, ManyToOne } from 'typeorm';
import { Item } from '../../items.entity';


@Entity("Items_services")
export class ItemPersonalization {
    @PrimaryColumn()
    id: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "varchar" })
    placement: "HEAD" | "MASK" | "PET" | "BODY" | "DANCE" | "GRAPHITY" | "EMOTE";
}