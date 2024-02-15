import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';


@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar", unique: true })
    slug: string;

    @Column({ type: "varchar" })
    hexColor: string;

    @Column({ type: "text" })
    permissions: string;

    @OneToMany(type => User, user => user.role)
    users: User[];
}