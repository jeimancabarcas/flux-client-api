import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { MedicalRecordTypeOrmEntity } from './medical-record.typeorm-entity';

@Entity('physical_examinations', { schema: 'fluxmedical' })
export class PhysicalExaminationTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'medical_record_id', unique: true })
    medicalRecordId: string;

    @Column('text', { nullable: true })
    content: string;

    @Column('decimal', { name: 'heart_rate', precision: 5, scale: 2, nullable: true })
    heartRate: number;

    @Column('decimal', { name: 'respiratory_rate', precision: 5, scale: 2, nullable: true })
    respiratoryRate: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    temperature: number;

    @Column('decimal', { name: 'systolic_blood_pressure', precision: 5, scale: 2, nullable: true })
    systolicBloodPressure: number;

    @Column('decimal', { name: 'diastolic_blood_pressure', precision: 5, scale: 2, nullable: true })
    diastolicBloodPressure: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    weight: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    height: number;

    @OneToOne(() => MedicalRecordTypeOrmEntity, (mr) => mr.physicalExamination)
    @JoinColumn({ name: 'medical_record_id' })
    medicalRecord: MedicalRecordTypeOrmEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
