import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMedicalRecordRepository } from '../../../../domain/repositories/medical-record.repository.interface';
import { MedicalRecord } from '../../../../domain/entities/medical-record.entity';
import { MedicalRecordTypeOrmEntity } from '../entities/medical-record.typeorm-entity';
import { MedicalRecordMapper } from '../mappers/medical-record.mapper';

@Injectable()
export class TypeOrmMedicalRecordRepository implements IMedicalRecordRepository {
    constructor(
        @InjectRepository(MedicalRecordTypeOrmEntity)
        private readonly repository: Repository<MedicalRecordTypeOrmEntity>,
    ) { }

    async save(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
        const entity = MedicalRecordMapper.toPersistence(medicalRecord);
        const saved = await this.repository.save(entity);
        return MedicalRecordMapper.toDomain(saved);
    }

    async findById(id: string): Promise<MedicalRecord | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['pediatricExtension', 'patientBackground', 'physicalExamination']
        });
        return entity ? MedicalRecordMapper.toDomain(entity) : null;
    }

    async findByAppointmentId(appointmentId: string): Promise<MedicalRecord | null> {
        const entity = await this.repository.findOne({
            where: { appointmentId: appointmentId as any },
            relations: {
                pediatricExtension: true,
                patientBackground: true,
                physicalExamination: true
            },
            order: { createdAt: 'DESC' }
        });
        return entity ? MedicalRecordMapper.toDomain(entity) : null;
    }

    async findByPatientId(patientId: string): Promise<MedicalRecord[]> {
        const entities = await this.repository.find({
            where: { patientId },
            relations: ['pediatricExtension', 'patientBackground', 'physicalExamination'],
            order: { createdAt: 'DESC' }
        });
        return entities.map(MedicalRecordMapper.toDomain);
    }
}
