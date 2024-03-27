import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users.entity';


@Entity("providers")
export class AuthProvider {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ type: "varchar" })
    provider: string;

    @Column({ type: "varchar", unique: true })
    providerId: string;

    @ManyToOne(type => User, user => user.providers)
    @JoinColumn()
    user: User
}