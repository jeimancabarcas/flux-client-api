import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../../../../../../common/enums/user-role.enum';

@Entity({ name: 'users', schema: 'fluxmedical' })
export class UserTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

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
}
