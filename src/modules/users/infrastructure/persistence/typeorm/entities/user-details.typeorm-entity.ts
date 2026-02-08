import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user_details', schema: 'fluxmedical' })
export class UserDetailsTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    cedula: string | null;

    @Column({ type: 'varchar', nullable: true })
    nombre: string | null;

    @Column({ type: 'varchar', nullable: true })
    apellido: string | null;

    @Column({ type: 'varchar', name: 'direccion_principal', nullable: true })
    direccionPrincipal: string | null;

    @Column({ type: 'varchar', name: 'direccion_secundaria', nullable: true })
    direccionSecundaria: string | null;

    @Column({ type: 'varchar', nullable: true })
    telefono: string | null;
}
