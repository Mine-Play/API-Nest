import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users.entity';
import { Session } from '../../sessions/sessions.entity';
import { OTPProviders } from './otp.types';

@Entity("users_totp")
export class OTP {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    provider: OTPProviders;

    @ManyToOne(() => User, (user) => user.totp)
    @JoinColumn()
    user: User

    @ManyToOne(() => Session, (session) => session.totp)
    @JoinColumn()
    session: Session
    
    @Column({ type: 'bigint', readonly: true, default: 0 })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.floor(Date.now() / 1000);
    }
}