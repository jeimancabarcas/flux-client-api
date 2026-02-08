import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'patients', schema: 'fluxmedical' })
export class PatientTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column({ name: 'tipo_identificacion' })
    tipoIdentificacion: string;

    @Column({ name: 'numero_identificacion', unique: true })
    numeroIdentificacion: string;

    @Column({ name: 'fecha_nacimiento', type: 'date' })
    fechaNacimiento: Date;

    @Column()
    genero: string;

    @Column({ type: 'varchar', nullable: true })
    email: string | null;

    @Column()
    telefono: string;

    @Column({ type: 'text', nullable: true })
    direccion: string | null;

    @Column({ name: 'habeas_data_consent', default: false })
    habeasDataConsent: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
