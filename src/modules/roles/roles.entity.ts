import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../users/users.entity';


@Entity("roles")
export class Role {
    @PrimaryColumn()
    id: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar", unique: true })
    slug: string;

    @Column({ type: "varchar" })
    hexColor: string;

    @Column({ type: "text" })
    permissions: string;

    @Column({ type: "boolean", default: false })
    isSell: boolean;

    @OneToMany(type => User, user => user.role)
    users: User[];
}