import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../../../domain/entities/patient.entity';
import { IPatientRepository } from '../../../../domain/repositories/patient.repository.interface';
import { PatientTypeOrmEntity } from '../entities/patient.typeorm-entity';
import { PatientMapper } from '../mappers/patient.mapper';

@Injectable()
export class TypeOrmPatientRepository implements IPatientRepository {
    constructor(
        @InjectRepository(PatientTypeOrmEntity)
        private readonly repository: Repository<PatientTypeOrmEntity>,
    ) { }

    async save(patient: Patient): Promise<Patient> {
        const entity = PatientMapper.toPersistence(patient);
        const saved = await this.repository.save(entity);
        return PatientMapper.toDomain(saved);
    }

    async findByIdentification(numeroIdentificacion: string): Promise<Patient | null> {
        const entity = await this.repository.findOne({ where: { numeroIdentificacion } });
        return entity ? PatientMapper.toDomain(entity) : null;
    }

    async findByNumeroIdentificacion(numeroIdentificacion: string): Promise<Patient | null> {
        const entity = await this.repository.findOne({ where: { numeroIdentificacion } });
        return entity ? PatientMapper.toDomain(entity) : null;
    }

    async findById(id: string): Promise<Patient | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? PatientMapper.toDomain(entity) : null;
    }

    async findAll(filters?: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ data: Patient[]; total: number }> {
        const qb = this.repository.createQueryBuilder('patient');

        if (filters?.search) {
            const search = filters.search.trim();
            qb.where(
                "unaccent(lower(concat(patient.nombres, ' ', patient.apellidos))) ILIKE unaccent(lower(:search))",
                { search: `%${search}%` },
            ).orWhere(
                "unaccent(lower(patient.numeroIdentificacion)) ILIKE unaccent(lower(:search))",
                { search: `%${search}%` },
            );
        }

        // Pagination
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        qb.orderBy('patient.createdAt', 'DESC');
        qb.skip(skip);
        qb.take(limit);

        const [entities, total] = await qb.getManyAndCount();

        return {
            data: entities.map(PatientMapper.toDomain),
            total,
        };
    }

    async update(id: string, patient: Patient): Promise<Patient> {
        const entity = PatientMapper.toPersistence(patient);
        entity.id = id;
        const updated = await this.repository.save(entity);
        return PatientMapper.toDomain(updated);
    }
}
