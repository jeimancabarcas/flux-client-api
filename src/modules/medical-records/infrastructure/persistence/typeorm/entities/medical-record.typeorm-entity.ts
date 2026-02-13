import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { AppointmentTypeOrmEntity } from '../../../../../appointments/infrastructure/persistence/typeorm/entities/appointment.typeorm-entity';
import { PatientTypeOrmEntity } from '../../../../../patients/infrastructure/persistence/typeorm/entities/patient.typeorm-entity';
import { UserTypeOrmEntity } from '../../../../../users/infrastructure/persistence/typeorm/entities/user.typeorm-entity';
import { PediatricExtensionTypeOrmEntity } from './pediatric-extension.typeorm-entity';
import { PatientBackgroundTypeOrmEntity } from './patient-background.typeorm-entity';
import { PhysicalExaminationTypeOrmEntity } from './physical-examination.typeorm-entity';

@Entity('medical_records', { schema: 'fluxmedical' })
export class MedicalRecordTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'appointment_id' })
    appointmentId: string;

    @Column({ type: 'uuid', name: 'patient_id' })
    patientId: string;

    @Column({ type: 'uuid', name: 'doctor_id' })
    doctorId: string;

    @Column('text')
    reason: string;

    @Column('text', { name: 'current_illness' })
    currentIllness: string;

    @OneToOne(() => PhysicalExaminationTypeOrmEntity, (pe) => pe.medicalRecord, { cascade: true })
    physicalExamination: PhysicalExaminationTypeOrmEntity;

    @Column('text', { name: 'diagnoses', array: true, default: '{}' })
    diagnoses: string[]; // CIE-11 codes

    @Column('text')
    plan: string;

    @OneToOne(() => PatientBackgroundTypeOrmEntity, (back) => back.medicalRecord, { cascade: true })
    patientBackground: PatientBackgroundTypeOrmEntity;

    @OneToOne(() => PediatricExtensionTypeOrmEntity, (ext) => ext.medicalRecord, { cascade: true })
    pediatricExtension: PediatricExtensionTypeOrmEntity;

    @ManyToOne(() => AppointmentTypeOrmEntity)
    @JoinColumn({ name: 'appointment_id' })
    appointment: AppointmentTypeOrmEntity;

    @ManyToOne(() => PatientTypeOrmEntity)
    @JoinColumn({ name: 'patient_id' })
    patient: PatientTypeOrmEntity;

    @ManyToOne(() => UserTypeOrmEntity)
    @JoinColumn({ name: 'doctor_id' })
    doctor: UserTypeOrmEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
