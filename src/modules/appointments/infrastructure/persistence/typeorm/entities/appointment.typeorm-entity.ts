import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AppointmentStatus } from '../../../../domain/entities/appointment-status.enum';
import { UserTypeOrmEntity } from '../../../../../users/infrastructure/persistence/typeorm/entities/user.typeorm-entity';
import { PatientTypeOrmEntity } from '../../../../../patients/infrastructure/persistence/typeorm/entities/patient.typeorm-entity';
import { InvoiceTypeOrmEntity } from '../../../../../billing/infrastructure/persistence/typeorm/entities/invoice.typeorm-entity';

@Entity({ name: 'appointments', schema: 'fluxmedical' })
export class AppointmentTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'patient_id' })
    patientId: string;

    @Column({ name: 'doctor_id' })
    doctorId: string;

    @Column({ name: 'start_time', type: 'timestamp' })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamp' })
    endTime: Date;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDIENTE,
    })
    status: AppointmentStatus;

    @Column({ type: 'text', nullable: true })
    reason: string | null;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @Column({ name: 'actual_start_time', type: 'timestamp', nullable: true })
    actualStartTime: Date | null;

    @Column({ name: 'actual_end_time', type: 'timestamp', nullable: true })
    actualEndTime: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => PatientTypeOrmEntity)
    @JoinColumn({ name: 'patient_id' })
    patient: PatientTypeOrmEntity;

    @ManyToOne(() => UserTypeOrmEntity)
    @JoinColumn({ name: 'doctor_id' })
    doctor: UserTypeOrmEntity;

    @OneToMany(() => InvoiceTypeOrmEntity, invoice => invoice.appointment)
    invoices: InvoiceTypeOrmEntity[];
}
