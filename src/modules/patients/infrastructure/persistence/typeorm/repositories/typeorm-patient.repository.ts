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

    async findById(id: string): Promise<Patient | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? PatientMapper.toDomain(entity) : null;
    }

    async findAll(filters?: { search?: string }): Promise<Patient[]> {
        const qb = this.repository.createQueryBuilder('patient');

        if (filters?.search) {
            const search = filters.search.trim();
            // Usamos unaccent para ignorar tildes y lower para que no sea case-sensitive
            // Concatenamos nombres y apellidos para permitir búsqueda por nombre completo
            qb.where(
                "unaccent(lower(concat(patient.nombres, ' ', patient.apellidos))) ILIKE unaccent(lower(:search))",
                { search: `%${search}%` },
            ).orWhere(
                "unaccent(lower(patient.numeroIdentificacion)) ILIKE unaccent(lower(:search))",
                { search: `%${search}%` },
            );
        }

        const entities = await qb.getMany();
        return entities.map(PatientMapper.toDomain);
    }

    async update(id: string, patient: Patient): Promise<Patient> {
        const entity = PatientMapper.toPersistence(patient);
        entity.id = id;
        const updated = await this.repository.save(entity);
        return PatientMapper.toDomain(updated);
    }
}
