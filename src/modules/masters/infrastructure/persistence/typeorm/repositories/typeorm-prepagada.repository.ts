import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPrepagadaRepository } from '../../../../domain/repositories/prepagada.repository.interface';
import { Prepagada } from '../../../../domain/entities/prepagada.entity';
import { PrepagadaTypeOrmEntity } from '../entities/prepagada.typeorm-entity';
import { PrepagadaMapper } from '../mappers/prepagada.mapper';

@Injectable()
export class TypeOrmPrepagadaRepository implements IPrepagadaRepository {
    constructor(
        @InjectRepository(PrepagadaTypeOrmEntity)
        private readonly repository: Repository<PrepagadaTypeOrmEntity>,
    ) { }

    async save(prepagada: Prepagada): Promise<Prepagada> {
        const entity = PrepagadaMapper.toPersistence(prepagada);
        const saved = await this.repository.save(entity);
        return PrepagadaMapper.toDomain(saved);
    }

    async findById(id: string): Promise<Prepagada | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? PrepagadaMapper.toDomain(entity) : null;
    }

    async findByName(name: string): Promise<Prepagada | null> {
        const entity = await this.repository.findOne({ where: { name } });
        return entity ? PrepagadaMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<Prepagada[]> {
        const entities = await this.repository.find({ order: { name: 'ASC' } });
        return entities.map(PrepagadaMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
