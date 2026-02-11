import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { AppointmentStatus } from '../../../../domain/entities/appointment-status.enum';
import { UserTypeOrmEntity } from '../../../../../users/infrastructure/persistence/typeorm/entities/user.typeorm-entity';
import { PatientTypeOrmEntity } from '../../../../../patients/infrastructure/persistence/typeorm/entities/patient.typeorm-entity';
import { ProductServiceTypeOrmEntity } from '../../../../../masters/infrastructure/persistence/typeorm/entities/product-service.typeorm-entity';

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

    @ManyToMany(() => ProductServiceTypeOrmEntity)
    @JoinTable({
        name: 'appointment_items',
        joinColumn: { name: 'appointment_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'product_service_id', referencedColumnName: 'id' },
        schema: 'fluxmedical'
    })
    items: ProductServiceTypeOrmEntity[];
}
