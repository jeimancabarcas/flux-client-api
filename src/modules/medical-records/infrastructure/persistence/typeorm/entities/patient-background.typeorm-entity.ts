import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { MedicalRecordTypeOrmEntity } from './medical-record.typeorm-entity';

@Entity('patient_backgrounds', { schema: 'fluxmedical' })
export class PatientBackgroundTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'medical_record_id', unique: true })
    medicalRecordId: string;

    @Column('text', { nullable: true })
    pathological: string;

    @Column('text', { nullable: true })
    surgical: string;

    @Column('text', { nullable: true })
    allergic: string;

    @Column('text', { nullable: true })
    pharmacological: string;

    @Column('text', { name: 'family_history', nullable: true })
    familyHistory: string;

    @Column('text', { name: 'review_of_systems', nullable: true })
    reviewOfSystems: string;

    @OneToOne(() => MedicalRecordTypeOrmEntity, (mr) => mr.patientBackground)
    @JoinColumn({ name: 'medical_record_id' })
    medicalRecord: MedicalRecordTypeOrmEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
