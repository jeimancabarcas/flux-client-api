import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../../../../../common/enums/user-role.enum';
import { UserDetailsTypeOrmEntity } from './user-details.typeorm-entity';

@Entity({ name: 'users', schema: 'fluxmedical' })
export class UserTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.RECEPCIONISTA,
    })
    role: UserRole;

    @OneToOne(() => UserDetailsTypeOrmEntity, { cascade: true, eager: true })
    @JoinColumn()
    details: UserDetailsTypeOrmEntity;
}
