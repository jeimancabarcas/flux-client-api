import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { MedicalRecordTypeOrmEntity } from './medical-record.typeorm-entity';

@Entity('pediatric_extensions', { schema: 'fluxmedical' })
export class PediatricExtensionTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'medical_record_id' })
    medicalRecordId: string;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    weight: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    height: number;

    @Column('decimal', { precision: 5, scale: 2, name: 'cephalic_perimeter', nullable: true })
    cephalicPerimeter: number;

    @Column('decimal', { precision: 5, scale: 2, name: 'abdominal_perimeter', nullable: true })
    abdominalPerimeter: number;

    @Column('text', { name: 'perinatal_history', nullable: true })
    perinatalHistory: string;

    @OneToOne(() => MedicalRecordTypeOrmEntity, (mr) => mr.pediatricExtension)
    @JoinColumn({ name: 'medical_record_id' })
    medicalRecord: MedicalRecordTypeOrmEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
