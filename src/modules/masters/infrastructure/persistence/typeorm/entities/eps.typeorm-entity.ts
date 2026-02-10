import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'eps_options', schema: 'fluxmedical' })
export class EpsTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
