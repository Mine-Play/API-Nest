import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne, BeforeInsert, OneToOne, JoinColumn } from 'typeorm';
import { Session } from './sessions/sessions.entity';
import { Role } from '../roles/roles.entity';
import { Confirmation } from '../verify/verify.entity';
import { Type } from 'class-transformer';
import { Wallet } from '../wallets/wallets.entity';
import { News } from '../news/news.entity';
import { NewsComment } from '../news/comments/news.comments.entity';
import { Texture } from './textures/textures.types';
import { UserParams } from './users.types';
import { AuthProvider } from './auth/auth.provider.entity';
import { Referal } from '../referals/referals.entity';
import { Order } from '../wallets/orders/orders.entity';
import { OTP } from './auth/OTP/otp.entity';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", unique: true })
    name: string;

    @Column({ type: "varchar", unique: true, select: false })
    email: string;

    
    @Column({ type: "varchar", select: false })
    password: string;


    /**
     * This is a GLOBAL level system
     * User has a experience and level
     * Level is recalculating when user's exp changes
     */
    @Column({ type: "integer", default: 1, select: false })
    level: number;

    @Column({ type: "integer", default: 0, select: false })
    exp: number;

    /**
     * Check if user confirmed his email
     */
    @Column({ type: "boolean", default: false, select: false })
    isEmailConfirmed: boolean;

    /**
     * Date when user changed his password
     * Default value: user's register date
     */
    @Column({ type: 'bigint', default: 0, select: false })
    passwordReset_at: number;

    @BeforeInsert()
    updateDatePasswordReset() {
        this.passwordReset_at = Math.floor(Date.now() / 1000);
    }

    @Column({ type: "timestamp", nullable: true, select: false })
    lastLogin: Date;

    /**
     * Texture system
     * User can choose default skins/cloaks or upload own skin
     * Values:
     * SKIN: 0 - default skin(Play)
     *       1 - uploaded skin
     *       2 - uploaded HD skin
     *       3 - choosed skin from MP library
     */

    @Column({ type: "integer", default: 0, select: false })
    skin: number | Texture;

    /**
     * CLOAK: 0 - NONE
     *        1 - uploaded cloak
     *        2 - uploaded HD cloak
     *        3 - choosed cloak from MP library(IN DEV)
     */
    @Column({ type: "integer", default: 0, select: false })
    cloak: number | Texture | boolean;

    /**
     * BANNER: 0 - Color banner
     *         1 - Banner from library
     *         2 - uploaded banner
     *         3 - uploaded ANIMATED banner (INDEV)
     */
    @Column({ type: "integer", default: 0, select: false })
    banner: number | Texture | boolean | string;

    /**
     * AVATAR: 0 - Skin face avatar(2d, isometric)
     *         1 - uploaded avatar
     *         2 - uploaded ANIMATED avatar (INDEV)
     */
    @Column({ type: "integer", default: 0, select: false })
    avatar: number | Texture;

    @OneToMany(type => Session, session => session.user)
    sessions: Session[];

    @OneToMany(type => Confirmation, confirmation => confirmation.user)
    confirmations: Confirmation[];

    @OneToMany(() => News, (news) => news.author)
    news: News[];

    @OneToMany(() => AuthProvider, (provider) => provider.user)
    providers: AuthProvider[];

    @OneToMany(() => NewsComment, (comment) => comment.author)
    comments: NewsComment[]


    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]

    @OneToMany(() => OTP, (otp) => otp.user)
    totp: OTP[]

    @OneToOne(type => Wallet, wallet => wallet.user)
    wallet: Wallet;

    @ManyToOne(type => Role, role => role.users)
    @JoinColumn()
    role: Role

    @ManyToOne(type => Referal, Referal => Referal.invited)
    @JoinColumn({ name: "invitedBy" })
    invitedBy: Referal

    @OneToOne(type => Referal, referal => referal.user)
    referal: Referal;

    @Column({ type: 'bigint', readonly: true, default: 0, select: false })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.floor(Date.now() / 1000);
    }

    @Column({ type: "simple-json", default: { banner: "#FFFFFF" }, select: false })
    params: UserParams
}