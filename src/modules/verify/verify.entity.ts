import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, BeforeInsert } from 'typeorm';
import { User } from '../users/users.entity';


@Entity("confirmations")
export class Confirmation {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "integer" })
    code: number;

    @Column({ type: "varchar" })
    type: string;

    @ManyToOne(() => User, (user) => user.confirmations)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
    user: User

    @Column({ type: 'bigint', default: 0 })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.round(new Date().getTime() / 1000);
    }
}