import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAgreementRepository } from '../../../../domain/repositories/agreement.repository.interface';
import { Agreement } from '../../../../domain/entities/agreement.entity';
import { AgreementTypeOrmEntity } from '../entities/agreement.typeorm-entity';
import { AgreementMapper } from '../mappers/agreement.mapper';

@Injectable()
export class TypeOrmAgreementRepository implements IAgreementRepository {
    constructor(
        @InjectRepository(AgreementTypeOrmEntity)
        private readonly repository: Repository<AgreementTypeOrmEntity>,
    ) { }

    async save(agreement: Agreement): Promise<Agreement> {
        const entity = AgreementMapper.toPersistence(agreement);
        const saved = await this.repository.save(entity);
        return AgreementMapper.toDomain(saved);
    }

    async findById(id: string): Promise<Agreement | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['productService', 'prepagada']
        });
        return entity ? AgreementMapper.toDomain(entity) : null;
    }

    async findByProductAndPrepagada(productServiceId: string, prepagadaId: string): Promise<Agreement | null> {
        const entity = await this.repository.findOne({
            where: { productServiceId, prepagadaId, isActive: true }
        });
        return entity ? AgreementMapper.toDomain(entity) : null;
    }

    async findAll(filters?: { prepagadaId?: string; isActive?: boolean }): Promise<Agreement[]> {
        const where: any = {};
        if (filters?.prepagadaId) where.prepagadaId = filters.prepagadaId;
        if (filters?.isActive !== undefined) where.isActive = filters.isActive;

        const entities = await this.repository.find({
            where,
            relations: ['productService', 'prepagada']
        });
        return entities.map(AgreementMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
