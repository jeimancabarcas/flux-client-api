import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ISpecialtyRepository } from '../../../../domain/repositories/specialty.repository.interface';
import { Specialty } from '../../../../domain/entities/specialty.entity';
import { SpecialtyTypeOrmEntity } from '../entities/specialty.typeorm-entity';
import { SpecialtyMapper } from '../mappers/specialty.mapper';

@Injectable()
export class TypeOrmSpecialtyRepository implements ISpecialtyRepository {
    constructor(
        @InjectRepository(SpecialtyTypeOrmEntity)
        private readonly repository: Repository<SpecialtyTypeOrmEntity>,
    ) { }

    async save(specialty: Specialty): Promise<Specialty> {
        const entity = SpecialtyMapper.toPersistence(specialty);
        const saved = await this.repository.save(entity);
        return SpecialtyMapper.toDomain(saved);
    }

    async findAll(): Promise<Specialty[]> {
        const entities = await this.repository.find();
        return entities.map(SpecialtyMapper.toDomain);
    }

    async findById(id: string): Promise<Specialty | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? SpecialtyMapper.toDomain(entity) : null;
    }

    async findManyByIds(ids: string[]): Promise<Specialty[]> {
        const entities = await this.repository.findBy({ id: In(ids) });
        return entities.map(SpecialtyMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
