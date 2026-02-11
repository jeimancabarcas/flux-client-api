import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { InvoiceStatus } from '../../../../domain/entities/invoice-status.enum';
import { InvoiceItemTypeOrmEntity } from './invoice-item.typeorm-entity';
import { AppointmentTypeOrmEntity } from '../../../../../appointments/infrastructure/persistence/typeorm/entities/appointment.typeorm-entity';
import { PatientTypeOrmEntity } from '../../../../../patients/infrastructure/persistence/typeorm/entities/patient.typeorm-entity';

@Entity('invoices', { schema: 'fluxmedical' })
export class InvoiceTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'appointment_id' })
    appointmentId: string;

    @Column({ type: 'uuid', name: 'patient_id' })
    patientId: string;

    @Column('varchar', { name: 'invoice_number', unique: true, nullable: true })
    invoiceNumber: string | null;

    @Column('decimal', { precision: 12, scale: 2 })
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.BORRADOR
    })
    status: InvoiceStatus;

    @OneToMany(() => InvoiceItemTypeOrmEntity, item => item.invoice, { cascade: true })
    items: InvoiceItemTypeOrmEntity[];

    @ManyToOne(() => AppointmentTypeOrmEntity)
    @JoinColumn({ name: 'appointment_id' })
    appointment: AppointmentTypeOrmEntity;

    @ManyToOne(() => PatientTypeOrmEntity)
    @JoinColumn({ name: 'patient_id' })
    patient: PatientTypeOrmEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
