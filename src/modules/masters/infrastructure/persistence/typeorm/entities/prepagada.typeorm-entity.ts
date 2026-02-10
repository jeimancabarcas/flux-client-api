import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'prepagada_options', schema: 'fluxmedical' })
export class PrepagadaTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
