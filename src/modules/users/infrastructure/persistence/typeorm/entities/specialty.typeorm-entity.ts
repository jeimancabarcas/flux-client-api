import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'specialties', schema: 'fluxmedical' })
export class SpecialtyTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;
}
