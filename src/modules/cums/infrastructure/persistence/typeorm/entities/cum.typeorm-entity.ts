import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('cums', { schema: 'fluxmedical' })
export class CumTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'expediente' })
    expediente: string;

    @Index()
    @Column({ name: 'producto' })
    producto: string;

    @Column({ name: 'titular' })
    titular: string;

    @Column({ name: 'registro_sanitario' })
    registroSanitario: string;

    @Column({ type: 'date', name: 'fecha_expedicion', nullable: true })
    fechaExpedicion: Date | null;

    @Column({ type: 'date', name: 'fecha_vencimiento', nullable: true })
    fechaVencimiento: Date | null;

    @Column({ name: 'estado_registro' })
    estadoRegistro: string;

    @Column({ name: 'expediente_cum' })
    expedienteCum: string;

    @Column({ name: 'consecutivo' })
    consecutivo: string;

    @Column({ type: 'decimal', name: 'cantidad_cum', precision: 10, scale: 2, nullable: true })
    cantidadCum: number | null;

    @Column({ type: 'text', name: 'descripcion_comercial' })
    descripcionComercial: string;

    @Column({ name: 'estado_cum' })
    estadoCum: string;

    @Column({ type: 'date', name: 'fecha_activo', nullable: true })
    fechaActivo: Date | null;

    @Column({ type: 'date', name: 'fecha_inactivo', nullable: true })
    fechaInactivo: Date | null;

    @Column({ name: 'muestra_medica' })
    muestraMedica: string;

    @Column({ name: 'unidad', nullable: true })
    unidad: string;

    @Index()
    @Column({ name: 'atc' })
    atc: string;

    @Column({ name: 'descripcion_atc' })
    descripcionAtc: string;

    @Column({ name: 'via_administracion' })
    viaAdministracion: string;

    @Column({ name: 'concentracion' })
    concentracion: string;

    @Index()
    @Column({ name: 'principio_activo' })
    principioActivo: string;

    @Column({ name: 'unidad_medida' })
    unidadMedida: string;

    @Column({ name: 'cantidad' })
    cantidad: string;

    @Column({ name: 'unidad_referencia' })
    unidadReferencia: string;

    @Column({ name: 'forma_farmaceutica' })
    formaFarmaceutica: string;

    @Column({ name: 'nombre_rol' })
    nombreRol: string;

    @Column({ name: 'tipo_rol' })
    tipoRol: string;

    @Column({ name: 'modalidad' })
    modalidad: string;

    @Column({ name: 'ium', nullable: true })
    ium: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
