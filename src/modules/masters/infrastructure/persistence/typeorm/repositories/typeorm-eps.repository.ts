import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEpsRepository } from '../../../../domain/repositories/eps.repository.interface';
import { Eps } from '../../../../domain/entities/eps.entity';
import { EpsTypeOrmEntity } from '../entities/eps.typeorm-entity';
import { EpsMapper } from '../mappers/eps.mapper';

@Injectable()
export class TypeOrmEpsRepository implements IEpsRepository {
    constructor(
        @InjectRepository(EpsTypeOrmEntity)
        private readonly repository: Repository<EpsTypeOrmEntity>,
    ) { }

    async save(eps: Eps): Promise<Eps> {
        const entity = EpsMapper.toPersistence(eps);
        const saved = await this.repository.save(entity);
        return EpsMapper.toDomain(saved);
    }

    async findById(id: string): Promise<Eps | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? EpsMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<Eps[]> {
        const entities = await this.repository.find({ order: { name: 'ASC' } });
        return entities.map(EpsMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
