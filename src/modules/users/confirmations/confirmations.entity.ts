import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, BeforeInsert } from 'typeorm';
import { User } from '../users.entity';


@Entity("confirmations")
export class Confirmation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "integer" })
    confirmBy: number;

    @Column({ type: "varchar" })
    jobId: string;

    @ManyToOne(() => User, (user) => user.confirmations)
    @JoinColumn()
    user: User

    @Column({ type: 'bigint', default: 0 })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.round(new Date().getTime() / 1000);
    }
}